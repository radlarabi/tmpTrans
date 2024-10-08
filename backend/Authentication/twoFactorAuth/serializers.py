from rest_framework import serializers
from user_auth.models import CustomUser


class SendOtpSerializer(serializers.ModelSerializer):
	custom_uid = serializers.CharField(required=True)

	class Meta:
		model = CustomUser
		fields = ['custom_uid']

class VerifyOtpSerializer(serializers.ModelSerializer):
	custom_uid = serializers.CharField(required=True)
	otp = serializers.CharField(required=True)

	class Meta:
		model = CustomUser
		fields = ['custom_uid', 'otp']
