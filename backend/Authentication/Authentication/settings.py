"""
Django settings for Authentication project.

Generated by 'django-admin startproject' using Django 5.1.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
import os


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-sh2il-vx=r!+2%dsi7=64&+sdfpa9i0cjsgv-^^4pry)*b&umj'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

SITE_ID = 1
# Application definition

INSTALLED_APPS = [
	'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',

    'user_auth',
    'main',
    'django.contrib.sites',
	'allauth',
	'allauth.account',
	'allauth.socialaccount',
	'allauth.socialaccount.providers.google',

 	'twoFactorAuth',
	'django_otp',
	'django_otp.plugins.otp_email',

	'rest_framework_simplejwt.token_blacklist'

]

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_ID') # .env
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_PWD') # .env
DEFAULT_FROM_EMAIL = os.getenv('EMAIL_ID')
EMAIL_TIMEOUT = 10  # seconds



# settings.py
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.gmail.com'  # or your email host
# EMAIL_PORT = 587  # or 465 for SSL
# EMAIL_USE_TLS = True  # or EMAIL_USE_SSL for port 465
# EMAIL_HOST_USER = 'aneddame.contact@gmail.com'  # your email address
# EMAIL_HOST_PASSWORD = '@roubi2001#'  # your email password
# DEFAULT_FROM_EMAIL = 'aneddame.contact@gmail.com'



# DEFAULT_FROM_EMAIL = 'm.aneddame01@gmail.com'


# SOCIALACCOUNT_PROVIDERS = {
#     'google': {
# 		'APP': {
#             'client_id': os.getenv('GGL_CLIENT_ID'), # <.env>
#             'secret': os.getenv('GGL_SECRET'), # <.env>
#             'key': ''
#         },
#         'SCOPE': [
#             'profile',
#             'email',
#         ],
# 		'AUTH_PARAMS': {"access_type": 'online'}
#     }
# }

AUTHENTICATION_BACKENDS = [
	'django.contrib.auth.backends.ModelBackend',
	'allauth.account.auth_backends.AuthenticationBackend',
]

REST_FRAMEWORK = {
	'DEFAULT_AUTHENTICATION_CLASSES': (
		'rest_framework_simplejwt.authentication.JWTAuthentication',
	)
}

from datetime import timedelta

SIMPLE_JWT = {
	"ACCESS_TOKEN_LIFETIME": timedelta(days=10),
	"REFRESH_TOKEN_LIFETIME": timedelta(days=60),
	"ROTATE_REFRESH_TOKENS": False,
	"BLACKLIST_AFTER_ROTATION": False,
	"UPDATE_LAST_LOGIN": False,

	"ALGORITHM": "HS256",
	"VERIFYING_KEY": "",
	"AUDIENCE": None,
	"ISSUER": None,
	"JSON_ENCODER": None,
	"JWK_URL": None,
	"LEEWAY": 0,

	"AUTH_HEADER_TYPES": ("Bearer",),
	"AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
	"USER_ID_FIELD": "id",
	"USER_ID_CLAIM": "user_id",
	"USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",

	"AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
	"TOKEN_TYPE_CLAIM": "token_type",
	"TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",

	"JTI_CLAIM": "jti",

	"SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
	"SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
	"SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),

	"TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainPairSerializer",
	"TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
	"TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
	"TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
	"SLIDING_TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainSlidingSerializer",
	"SLIDING_TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSlidingSerializer",
}



MIDDLEWARE = [
	"corsheaders.middleware.CorsMiddleware",
	'django.middleware.security.SecurityMiddleware',
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.common.CommonMiddleware',
	'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
	'django.middleware.clickjacking.XFrameOptionsMiddleware',

	'allauth.account.middleware.AccountMiddleware',
]
CORS_ALLOW_ALL_ORIGINS = True



# CORS_ALLOW_METHODS = [
#     'GET',
#     'POST',
#     'PUT',
#     'PATCH',
#     'DELETE',
#     'OPTIONS',
# ]

# CORS_ALLOW_HEADERS = (
#     'accept',
#     'authorization',
#     'content-Type',
#     'x-CSRFToken',
#     'x-Requested-With',
# 	'access-Control-Allow-Origin'
# )

# CORS_ALLOW_CREDENTIALS = True

ROOT_URLCONF = 'Authentication.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',

                'django.template.context_processors.request',

            ],
        },
    },
]

# HEADLESS_ONLY = True

WSGI_APPLICATION = 'Authentication.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases


DATABASES = {
	'default': {
		'ENGINE': 'django.db.backends.postgresql',

		'NAME': os.getenv('DB_NAME', 'db_var_not_found'),
		'USER': os.getenv('DB_USER', 'db_user_var_not_found'),
		'PASSWORD': os.getenv('DB_PWD', 'pwd_var_not_found'),
		'HOST': os.getenv('DB_HOST', 'host_var_not_found'),
		'PORT': os.getenv('DB_PORT', 'port_var_not_found'),


  		# 'NAME': 'pingpong_db',
		# 'USER': 'postgres',
		# 'PASSWORD': '1234',
		# 'HOST': 'database',
		# 'PORT': '5432'
	}
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'user_auth.CustomUser'


LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/"

MEDIA_URL = '/media/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')
