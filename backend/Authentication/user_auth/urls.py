from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import registerUser, loginUser, auth42, getCode, logoutUser, verifyTokenView, verify_mail

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
	# path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', registerUser, name='register_user'),
    path('login/', loginUser.as_view(), name='login_user'),
    # path('dashboard/', dashboard, name='dashboard'),


    path('auth42/', auth42, name='auth42'),
    path('code/', getCode, name='getCode'),
    path('logout/', logoutUser.as_view(), name='logoutuSer'),

    path('access/verify', verifyTokenView.as_view(), name='verifyAccessToken'),

    path('mail/verify/<str:username>/<str:token>/', verify_mail, name='verify_email'),

]

if settings.DEBUG:
	urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
