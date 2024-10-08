
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('/game/local/', include('appgame.urls')),
    path('api/',include('appgame.urls')),
]
