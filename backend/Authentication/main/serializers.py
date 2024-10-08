from rest_framework import serializers
from user_auth.models import CustomUser

from rest_framework import serializers

from rest_framework.validators import UniqueValidator

class EditProfileSerializer(serializers.ModelSerializer):

	class Meta:
		model = CustomUser
		fields = ('username', 'first_name', 'last_name', 'avatar', 'game_theme', 'is_2fa_enabled')


import logging as logger

class UserDetailsSerializer(serializers.ModelSerializer):
	avatar = serializers.SerializerMethodField()

	class Meta:
		model = CustomUser
		fields = ('username', 'first_name', 'last_name', 'email', 'avatar', 'game_theme', 'played_games_num', 'points', 'friends', 'blocked')

	def get_avatar(self, obj):
		if obj.avatar:
			# Return the relative path (without the domain)
			return obj.avatar.url  # Returns 'avatars/profile.jpg'
		return None

class EditPasswordSerializer(serializers.ModelSerializer):
	password2 = serializers.CharField(write_only=True, required=True)
	old_password = serializers.CharField(write_only=True, required=True)

	class Meta:
		model = CustomUser
		fields = ('old_password', 'password', 'password2')


class AddFriendSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = ('username',)

class AvatarPathField(serializers.ImageField):
	def to_representation(self, value):
		if not value:
			return None
		return value.name

class GetFriendInfoSerializer(serializers.ModelSerializer):
	avatar = AvatarPathField()
	class Meta:
		model = CustomUser
		fields = ('username', 'first_name', 'last_name', 'avatar', 'played_games_num', 'points')


class NewGameSerializer(serializers.ModelSerializer):
	class Meta:
		# model = CustomUser
		fields = ('username1', 'username2', 'score1', 'score2')
