from django.urls import re_path
from appgame.consumers import GameConsumer
from appgame.remoteGame import RemoteConsumer
from appgame.localGame import LocalConsumer

websocket_urlpatterns = [
    re_path(r'ws/wait_for_opponent', GameConsumer.as_asgi()),
    re_path(r'ws/room/(?P<room_name>\w+)/$', RemoteConsumer.as_asgi()),
    re_path(r'ws/local/(?P<game_id>\w+)/$',LocalConsumer.as_asgi()),
]
