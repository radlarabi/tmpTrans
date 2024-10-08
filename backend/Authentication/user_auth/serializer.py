from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser


class RegisterCustomUserSerializer(serializers.ModelSerializer):
	password2 = serializers.CharField(write_only=True, required=True)
	avatar = serializers.URLField(required=False)
	# is_42_auth = serializers.BooleanField(required=False)
	user42_id = serializers.CharField(required=False)

	class Meta:
		model = CustomUser
		fields = ['email', 'username', 'first_name', 'last_name', 'password', 'password2', 'avatar', 'user42_id']

	def save(self):
		password = self.validated_data['password']
		password2 = self.validated_data['password2']

		if password != password2:
			raise serializers.ValidationError({"Error": "Passwords fields didn't match"})

		newUser = CustomUser(
			email = self.validated_data['email'],
			username = self.validated_data['username'],
			first_name = self.validated_data['first_name'],
			last_name = self.validated_data['last_name'],
			# is_2fa_enabled = self.validated_data['is_2fa_enabled'],
		)

		# print(f'\n\n\n{self.validated_data.get('is_42_auth')}\n\n\n')

		if self.validated_data.get('user42_id'):
			newUser.avatar = self.validated_data.get('avatar')
			newUser.user42_id = self.validated_data.get('user42_id')
			newUser.set_unusable_password()
			newUser.verified_email = True
		else:
			newUser.set_password(password)

		newUser.save()
		return newUser

class LoginCustomUserSerializer(serializers.ModelSerializer):
	username = serializers.CharField(max_length=255)
	password = serializers.CharField(max_length=255)
	class Meta:
		model = CustomUser
		fields = ['username', 'password']



