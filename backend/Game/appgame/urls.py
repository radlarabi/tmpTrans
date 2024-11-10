from django.contrib import admin
from django.urls import include, path
from django.urls import path
from .views import  PlayerHistoryView,TournamentViewSet,PlayerViewSet,MatchViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'tournaments', TournamentViewSet)
router.register(r'players', PlayerViewSet)
router.register(r'matches', MatchViewSet)
urlpatterns = [
    
    # path('api/start-game/', start_game, name='start_game'),
    path('history/',PlayerHistoryView.as_view(),name='PlayerHistory'),
    path('', include(router.urls)),
    
]