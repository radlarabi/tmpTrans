from django.urls import path
from .views import Send_otp, Verify_user_otp

urlpatterns = [
	path('send/', Send_otp.as_view(), name='send-otp'),
	path('verify/', Verify_user_otp.as_view(), name='verify-otp')
]
