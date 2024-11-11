from django.urls import re_path
from appgame.consumers import GameConsumer
from appgame.remoteGame import RemoteConsumer
from appgame.localGame import LocalConsumer
from appgame.torn import TournamentConsumer


websocket_urlpatterns = [
    re_path(r'ws/wait_for_opponent', GameConsumer.as_asgi()),
    re_path(r'ws/room/(?P<room_name>\w+)/$', RemoteConsumer.as_asgi()),
    re_path(r'ws/local/(?P<game_id>\w+)/$',LocalConsumer.as_asgi()),
    re_path(r'ws/tournament/(?P<tournament_name>\w+)/$', TournamentConsumer.as_asgi()),
]
