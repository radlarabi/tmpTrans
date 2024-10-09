from .models import CustomUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.shortcuts import render, redirect
from django.utils.crypto import get_random_string
from django.contrib.auth import authenticate, logout
from rest_framework.exceptions import ErrorDetail
from .serializer import RegisterCustomUserSerializer, LoginCustomUserSerializer
from requests import post, get
import json
import random
import string
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from django.shortcuts import get_object_or_404


import logging
import os

logger = logging.getLogger('django.request')


from .utils import generate_verification_url


def verify_mail(request, username, token):
	user = get_object_or_404(CustomUser, username=username)

	if str(user.custom_uid) == str(token):
		user.verified_email = True
		user.save()
	else:
		return Response({'Error': 'Invalid token'})

	return redirect(f'{os.getenv('FRONT_IP')}/#/login')


def send_verification_email(recipient):
	verificationUrl = generate_verification_url(recipient)

	subject = 'Pingpong mail verification'
	message = f'Hello {recipient.username},\n\nPlease click the link below to verify your email:\n\n{verificationUrl}'

	logger.error(f'subject: {subject}, message: {message}\ndefaul mail: {settings.DEFAULT_FROM_EMAIL}, recipient: {recipient.email}')

	send_mail(
		subject,
		message,
		settings.DEFAULT_FROM_EMAIL,
		[recipient.email]
	)


@api_view(['POST'])
def registerUser(request):

	serializer = RegisterCustomUserSerializer(data=request.data)

	if not serializer.is_valid():
		if 'username' in serializer.errors:
			for error in serializer.errors['username']:
				if isinstance(error, ErrorDetail):
					# if the user is already registered as 42 user
					if error.code == 'unique' and request.data.get('user42_id'):
						if CustomUser.objects.filter(user42_id=request.data.get('user42_id')).exists():
							# login => return refresh token
							user = CustomUser.objects.get(user42_id=request.data.get('user42_id'))

							refresh = RefreshToken.for_user(user)
							response = {
								'message': 'Logged in',
								'refresh': str(refresh),
								'access': str(refresh.access_token),
							}
							logger.error(f'\n\n\naccess: {response["access"]}\nrefresh: {response["refresh"]}\n\n\n')
							return Response(response, status=status.HTTP_200_OK)
						else:
							# logic to rename username
							newUsername = request.data.get('username')
							while CustomUser.objects.filter(username=newUsername).first():
								newUsername = request.data.get('username')
								newUsername =  f"{newUsername}_{''.join(random.choices(string.digits, k=6))}" # hna galia haytam dir uahd lfunction (slugify)

							_data = request.data.copy()
							_data['username'] = newUsername
							serializer = RegisterCustomUserSerializer(data=_data)
							if serializer.is_valid():
								user = serializer.save()
								return Response("Account created succesfuly", status=status.HTTP_201_CREATED)
							else:
								return Response(serializer.errors, status=400)

		return Response(serializer.errors, status=400)
	else:
		user = serializer.save()
		if user.user42_id:
			refresh = RefreshToken.for_user(user)
			response = {
				'message': 'Logged in',
				'refresh': str(refresh),
				'access': str(refresh.access_token),
			}
			logger.error(f'\n\n{response['access']}\n\n')
			return Response(response, status=status.HTTP_200_OK)
		else:
			send_verification_email(user)
		return Response("Account created succesfuly, need mail verification", status=status.HTTP_201_CREATED)


class loginUser(APIView):
	permission_classes = [AllowAny]
	def post(self, request):
		serializer = LoginCustomUserSerializer(data=request.data)
		if serializer.is_valid():
			username = serializer.validated_data['username']
			password = serializer.validated_data['password']

			user = authenticate(username=username, password=password)
			if not user:
				response = {"Error": "Invalid credentials"}
				return Response(response, status=status.HTTP_401_UNAUTHORIZED)
			else:
				# check if the user's 2fa is activated
				if user.is_2fa_enabled:
					# setup_and_send_otp(user)
					response = {'response': 'Account logged in succesfuly, need otp verification..', 'uid': user.custom_uid}
					return Response(response, status=status.HTTP_403_FORBIDDEN)
				if not user.verified_email:
					response = {'response': 'Account logged in succesfuly, need mail verification..'}
					return Response(response, status=status.HTTP_403_FORBIDDEN)

				refresh = RefreshToken.for_user(user)
				response = {
					'message': 'Logged in',
					'refresh': str(refresh),
					'access': str(refresh.access_token),
				}
				return Response(response, status=status.HTTP_202_ACCEPTED)
		else:
			return Response(serializer.errors, status=400)

from rest_framework_simplejwt.tokens import RefreshToken

class logoutUser(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		try:
			# refresh = request.headers.get('refresh')
			refresh = request.data["refresh"]

		except Exception as e:
			return Response({'error': 'Invalid token'}, status=400)

		ref_token = RefreshToken(refresh)
		ref_token.blacklist()
		logger.error('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nLOGGED OUT\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
		return Response({'message': 'Successfully logged out'})

def auth42(request):
	client_id = os.getenv('42_CLIENT_ID')
	return redirect(f'https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000&response_type=code')


# import logging as logger

@api_view(['GET'])
def getCode(request):
	if 'code' in request.GET:
		code = request.GET['code']
		token_url = "https://api.intra.42.fr/oauth/token"
		data = {
			"grant_type": "authorization_code",
			"client_id": os.getenv('42_CLIENT_ID'), # <.env>
			"client_secret": os.getenv('42_SECRET_ID'),  # <.env>
			"code": code,
			"redirect_uri": os.getenv('FRONT_IP'), # <.env>
		}
		response = post(token_url, data=data)


		if response.status_code == 200:
			access_token = response.json()["access_token"]
			token_url = "https://api.intra.42.fr/v2/me/"
			bearer = "Bearer " + access_token
			header = {
				"Authorization": bearer,
			}
			res = get(token_url, headers=header)


			if res.status_code == 200:
				res = json.loads(res.text)
				pwd = get_random_string(length=32)
				newUser = {
					'email': res['email'],
					'username': res['login'],
					'user42_id': res['id'],
					'first_name': res['first_name'],
					'last_name': res['last_name'],
					'avatar': res['image']['link'],
					'password': pwd,
					'password2': pwd,
				}

				# print(f'\n\n New user: {newUser}\n\n')
				response = post('http://127.0.0.1:8000/api/auth/register/', json=newUser) # <.env>
				# print(f'\n\n status code: {response.status_code}\n\n')

				if response.status_code == 200:
					response = {
						'message': response.json()['message'],
						'refresh': response.json()['refresh'],
						'access': response.json()['access']
					}
					return Response(response, status=status.HTTP_202_ACCEPTED)
				elif response.status_code == 201:
					return Response({"message": "Account created succesfuly"}, status=status.HTTP_201_CREATED)

		else:
			return Response({"message": "Error: " + response.text}, status=400)

	return Response({'message': 'error fetching user data'}, status=400)


from rest_framework_simplejwt.backends import TokenBackend

class verifyTokenView(APIView):
	def get(self, request):
		try:
			token = request.headers.get('Authorization')
			token = token.split(' ')[1]
		except Exception as e:
			return Response({'error': 'Invalid token'}, status=400)
		try:
			token_backend = TokenBackend(algorithm='HS256')  # Ensure the algorithm matches your JWT settings
			valid_data = token_backend.decode(token, verify=True)
			user_id = valid_data['user_id']

			return Response({'status': 'Valid access token', 'user_id': user_id}, status=200)
		except Exception as e:
			return Response({'error': str(e)}, status=401)
