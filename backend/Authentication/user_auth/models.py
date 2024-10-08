from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.base_user import BaseUserManager

class UserManager(BaseUserManager):
	def create_user(self, email, username, password, first_name, last_name, **extra_fields):
		user = self.model(email=email, username=username, first_name=first_name, last_name=last_name, **extra_fields)
		email = self.normalize_email(email)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email, username, password, first_name, last_name, **extra_fields):
		extra_fields.setdefault('is_superuser', True)
		extra_fields.setdefault('is_staff', True)
		extra_fields.setdefault('is_active', True)

		return self.create_user(email, username, password, first_name, last_name, **extra_fields)

from django.utils.translation import gettext_lazy as _
import uuid
from django.utils.crypto import get_random_string

# from django_uidfield.fields import UIDField

class CustomUser(AbstractBaseUser, PermissionsMixin):
	is_superuser = models.BooleanField(default=False)
	is_staff = models.BooleanField(default=False)
	is_active = models.BooleanField(default=True)
	email = models.EmailField(unique=True)
	# custom_uid = models.CharField(unique=True, max_length=32, default=get_random_string(32), editable=False)
	custom_uid = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
	is_2fa_enabled = models.BooleanField(default=False)
	verified_email = models.BooleanField(default=False)
	username = models.CharField(max_length=20, unique=True, blank=False, null=False)
	first_name = models.CharField(max_length=20, blank=False)
	last_name = models.CharField(max_length=20, blank=False)
	password = models.CharField(max_length=255, blank=False)
	avatar = models.ImageField(upload_to='avatars', blank=True, null=True)
	is_online = models.BooleanField(default=False)
	game_theme = models.ImageField(upload_to='themes', blank=True, null=True)
	played_games_num = models.PositiveIntegerField(default=0)
	points = models.PositiveIntegerField(default=0)
	user42_id = models.CharField(max_length=255, unique=True, blank=True, null=True)
	wins = models.PositiveIntegerField(default=0)
	losts = models.PositiveIntegerField(default=0)


	# friend list
	friends = models.ManyToManyField("self", blank=True)
	blocked = models.ManyToManyField("self", symmetrical=False, related_name="blocked_by", blank=True)

	# friends = ArrayField(models.CharField(max_length=20), blank=True, null=True)
	# blocked = ArrayField(models.CharField(max_length=20), blank=True, null=True)
	# pendingRequests = ArrayField(models.CharField(max_length=20), blank=True, null=True)


	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

	objects = UserManager()

	def __str__(self):
		return self.username
