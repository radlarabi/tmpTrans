from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from .serializers import (
	EditProfileSerializer, EditPasswordSerializer,
	UserDetailsSerializer, AddFriendSerializer, GetFriendInfoSerializer, NewGameSerializer
)
from user_auth.models import CustomUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import generics
from rest_framework import serializers
from rest_framework import status



class CustomUserUpdateAPIView(generics.RetrieveUpdateAPIView):
	serializer_class = EditProfileSerializer
	permission_classes = [IsAuthenticated]

	def get_object(self):
		return self.request.user

	def update(self, request, *args, **kwargs):
		user = self.get_object()
		serializer = self.get_serializer(user, data=request.data, partial=True)
		serializer.is_valid(raise_exception=True)
		serializer.save()
		return Response({'message': 'done'}, status=status.HTTP_200_OK)

from django.contrib.auth.hashers import check_password


class UserUpdatePasswordAPIView(generics.RetrieveUpdateAPIView):
	permission_classes = [IsAuthenticated]
	serializer_class = EditPasswordSerializer

	def get_object(self):
		return self.request.user

	def update(self, request, *args, **kwargs):
		user = self.get_object()
		serializer = self.get_serializer(user, data=request.data)
		# serializer.is_valid(raise_exception=True)
		# print('\nid valid {}\n')
		if serializer.is_valid():
			if user.user42_id != None:
				return Response({"message": "42 user cannot change password"}, status=401)

			old_password = serializer.validated_data['old_password']
			password = serializer.validated_data['password']
			password2 = serializer.validated_data['password2']

			if password != password2:
				raise serializers.ValidationError({"Error": "Passwords fields didn't match"})
			is_old_pwd_valid = check_password(old_password, user.password)
			if not is_old_pwd_valid:
				raise serializers.ValidationError({"Error": "Invalid old password"})
			if password == old_password:
				raise serializers.ValidationError({"Error": "new and old passwords shouldn't match"})
			user.set_password(password)
			user.save()
			return Response({'message': 'Password changed successfuly'}, status=status.HTTP_200_OK)
		else:
			return Response(serializer.errors, status=400)

def getFriendsObjects(instance):
	friends_usernames = instance.friends
	# if friends_usernames:
	# 	response = {}
	# 	for friend in friends_usernames:
	# 		if CustomUser.objects.filter(username=friend).count == 0:
	# 			# print(f'\n\n---> {CustomUser.objects.filter(username=friend)}\n\n')
	# 			raise Exception("Friend doesn't exist")
	# 		friendObject = CustomUser.objects.get(username=friend)
	# 		response[friend] = friendObject
	# else:
	# 	response = None
	return {'da': friends_usernames}

def getBlockedFriendsObjects(instance):
	blocked_usernames = instance.blocked
	print(f'\n\n------- {blocked_usernames} --------\n\n')
	if blocked_usernames:
		response = {}
		for blocked in blocked_usernames:
			if CustomUser.objects.filter(username=blocked).count == 0:
				raise Exception("Friend doesn't exist")
			blockedObject = CustomUser.objects.get(username=blocked)
			response[blocked] = blockedObject
	else:
		response = None
	return response

def getPendingRequestsObjects(instance):
	pendingRequests = instance.pendingRequests
	if pendingRequests:
		response = {}
		for pending in pendingRequests:
			if CustomUser.objects.filter(username=pending).count == 0:
				raise Exception("Friend doesn't exist")
			pendingObjects = CustomUser.objects.get(username=pending)
			response[pendingRequests] = pendingObjects
	else:
		response = None

	return response


import logging as logger

class UserDetailsView(generics.RetrieveAPIView):
	permission_classes = [IsAuthenticated]
	queryset = CustomUser.objects.all()
	serializer_class = UserDetailsSerializer

	def get_object(self):
		return self.request.user

	# def get_username(self, obj):
	# 	logger.error('\n\nhahahahahha\n\n')
	# 	if obj.avatar:
	# 		return obj.avatar.url  # This returns the relative URL (e.g., /media/avatars/profile.jpg)
	# 	return None

	def get(self, request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		data = serializer.data

		return Response(data, status=status.HTTP_200_OK)


class DeleteUserAccountView(generics.DestroyAPIView):
	permission_classes = [IsAuthenticated]
	queryset = CustomUser.objects.all()

	def get_object(self):
		return self.request.user

class AddFriendView(APIView):
	permission_classes = [IsAuthenticated]
	serializer_class = AddFriendSerializer

	def post(self, request):
		instance = request.user
		# friendsList = list(friend.username for friend in instance.friends.all())
		toAdd = request.data.get('username')
		blockedList = list(friend.username for friend in instance.blocked.all())
		try:
			if toAdd == instance.username:
				raise Exception("Cannot add same username as instance user")
			elif toAdd in blockedList:
				raise Exception("Already blocked friend")

			instance.friends.add(CustomUser.objects.get(username=toAdd))
			response = {'message': 'Added successfuly'}
			return Response(response, status=status.HTTP_201_CREATED)

		except Exception as e:
			response = {'error': str(e)}
			return Response(response, status=status.HTTP_400_BAD_REQUEST)

class FriendsListView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		instance = request.user
		friendsList = instance.friends.all()
		# print('\n\nthis is the endpint\n\n')

		# print(friendsList)
		lst = [friend.username for friend in friendsList]

		return Response({"friends": lst}, status=status.HTTP_200_OK)


class RemoveFriendView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		instance = request.user
		toRemove = request.data.get('username')

		if not toRemove:
			return Response({'username': 'This field is required.'}, 400)
		if toRemove in list(friend.username for friend in instance.friends.all()):
			instance.friends.remove(CustomUser.objects.get(username=toRemove))
			return Response({'message': 'friend removed.'}, 200)
		return Response({'message': 'Friend not found.'}, 404)




class AddRequestView(APIView):
	permission_classes = [IsAuthenticated]
	serializer_class = AddFriendSerializer

	def post(self, request):
		instance = request.user

		try:
			if not instance.pendingRequests:
				if CustomUser.objects.filter(username=request.data.get('username')).count() == 0:
					return Response({"message": "Invalid user"}, status=status.HTTP_400_BAD_REQUEST)
				instance.pendingRequests = [request.data.get('username')]
			else:
				if request.data.get('username') in list(instance.pendingRequests):
					raise Exception()
				if CustomUser.objects.filter(username=request.data.get('username')).count() == 0:
					return Response({"message": "Invalid user"}, status=status.HTTP_400_BAD_REQUEST)
				instance.pendingRequests.append(request.data.get('username'))
			instance.save()
		except:
			response = {'message': 'Already exist friend'}
			return Response(response, status=status.HTTP_400_BAD_REQUEST)
		response = {'message': 'Friend added to pending requests successfuly'}
		return Response(response, status=status.HTTP_201_CREATED)



class ListFriendDetailsView(generics.RetrieveAPIView):
	queryset = CustomUser.objects.all()
	serializer_class = GetFriendInfoSerializer
	permission_classes = [IsAuthenticated]

	# def get_object(self):
	lookup_field = 'username'


class BlockFriendView(APIView):
	permission_classes = [IsAuthenticated]
	serializer_class = AddFriendSerializer

	def post(self, request):
		instance = request.user
		toBlock = request.data.get('username')
		friendsList = list(friend.username for friend in instance.friends.all())

		if toBlock == instance.username or toBlock not in friendsList:
			return Response({'error': 'Invalid friend'})

		instance.blocked.add(CustomUser.objects.get(username=toBlock))
		instance.friends.remove(CustomUser.objects.get(username=toBlock))
		response = {'message': 'Friend blocked successfuly'}

		print (f'\n{CustomUser.objects.get(username=toBlock).blocked_by.all()}\n')
		return Response(response, status=status.HTTP_200_OK)



class UnblockFriendView(APIView):
	permission_classes = [IsAuthenticated]
	serializer_class = AddFriendSerializer

	def post(self, request):
		instance = request.user
		toUnBlock = request.data.get('username')
		blockedList = list(friend.username for friend in instance.blocked.all())

		if toUnBlock == instance.username or toUnBlock not in blockedList:
			return Response({'error': 'Invalid friend'})

		instance.friends.add(CustomUser.objects.get(username=toUnBlock))
		instance.blocked.remove(CustomUser.objects.get(username=toUnBlock))
		response = {'message': 'Friend unblocked successfuly'}
		return Response(response, status=status.HTTP_200_OK)



class GetUsersListView(generics.ListAPIView):
	queryset = CustomUser.objects.all()
	permission_classes = [IsAuthenticated]
	serializer_class = UserDetailsSerializer


class NewGame(APIView):
	permission_classes = [IsAuthenticated]
	# serializers_class = NewGameSerializer

	def put(self, request):
		# serializer = NewGameSerializer(data=request.data)
		# if serializer.is_valid():
		logger.error('\n\n')
		logger.error(request.data)
		logger.error('\n\n')
		return Response(request.data, 200)
		return Response({}, 400)

