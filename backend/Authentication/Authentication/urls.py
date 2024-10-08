from django.contrib import admin
from django.urls import include, path


# from dj_rest_auth.registration.views import SocialLoginView
# from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter

# class GoogleLogin(SocialLoginView):
#     adapter_class = GoogleOAuth2Adapter




urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/auth/', include('user_auth.urls')),
	path('api/auth/otp/', include('twoFactorAuth.urls')),
    path('api/profile/', include('main.urls')),
    # path('accounts/', include('allauth.urls')),

    # path('api/auth/google/', GoogleLogin.as_view(), name='google_login'),
]
