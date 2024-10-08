from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from django_otp.plugins.otp_email.models import EmailDevice
from user_auth.models import CustomUser
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import SendOtpSerializer, VerifyOtpSerializer



class Send_otp(APIView):

	def post(self, request):
		serializer = SendOtpSerializer(data=request.data)
		if serializer.is_valid():
			try:
				user = CustomUser.objects.get(custom_uid=request.data.get('custom_uid'))
			except:
				return Response({'Error': 'Invalid UID'}, status=400)

			if user:
				# Create or get the EmailDevice for the user
				device, created = EmailDevice.objects.get_or_create(user=user, email=user.email)
				# Generate and send the OTP
				device.generate_challenge()
				return Response({'Message': 'Otp sent successfuly'}, status=200)
			return Response({'Error': 'Invalid UID'}, status=400)
		else:
			return Response(serializer.errors, status=400)


from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


class Verify_user_otp(APIView):

	def post(self, request):
		serializer = VerifyOtpSerializer(data=request.data)
		if serializer.is_valid():
			try:
				user = CustomUser.objects.get(custom_uid=request.data.get('custom_uid'))
				print(f'\n\nusername: {user.username}, password: {user.password}\n\n')

			except:
				return Response({'Error': 'Invalid UID'}, status=400)
			otp = request.data.get('otp')
			if user:
				device = EmailDevice.objects.get(user=user)
				if device.verify_token(otp):
					# print(f'\n\nusername: {user.username}, password: {user.password}\n\n')
					# user = authenticate(username='maneddam', password='1234')
					# if user.check_password(user.password):
					refresh = RefreshToken.for_user(user)
					response = {
						'message': 'Otp validated, Logged in',
						'refresh': str(refresh),
						'access': str(refresh.access_token),
					}
					return Response(response, status=200)
				else:
					return Response({'Error': 'Invalid otp'}, status=400)


			return Response({'Error': 'Invalid UID'}, status=400)
		else:
			return Response(serializer.errors, status=400)


    # if device.verify_token(otp):
    #     # OTP is valid
    #     return True
    # else:
    #     # OTP is invalid or expired
    #     return False
