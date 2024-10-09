# Generated by Django 5.1 on 2024-10-08 19:20

import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('custom_uid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('is_2fa_enabled', models.BooleanField(default=False)),
                ('verified_email', models.BooleanField(default=False)),
                ('username', models.CharField(max_length=20, unique=True)),
                ('first_name', models.CharField(max_length=20)),
                ('last_name', models.CharField(max_length=20)),
                ('password', models.CharField(max_length=255)),
                ('avatar', models.ImageField(blank=True, null=True, upload_to='avatars')),
                ('is_online', models.BooleanField(default=False)),
                ('game_theme', models.ImageField(blank=True, null=True, upload_to='themes')),
                ('played_games_num', models.PositiveIntegerField(default=0)),
                ('points', models.PositiveIntegerField(default=0)),
                ('user42_id', models.CharField(blank=True, max_length=255, null=True, unique=True)),
                ('wins', models.PositiveIntegerField(default=0)),
                ('losts', models.PositiveIntegerField(default=0)),
                ('blocked', models.ManyToManyField(blank=True, related_name='blocked_by', to=settings.AUTH_USER_MODEL)),
                ('friends', models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
