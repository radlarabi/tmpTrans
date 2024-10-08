import json
import asyncio
import logging
from django.http import HttpResponse
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from asgiref.sync import sync_to_async
from .models import GameRoom, Player
from .utils import make_key
from .serializer import PlayerSerializer
from collections import deque
from django.core.exceptions import ObjectDoesNotExist

# stack = 
logger = logging.getLogger(__name__)

# Create a global async queue to manage matchmaking
matchmaking_queue = deque()
queue_lock = asyncio.Lock()

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user_id = self.scope['user']
        if user_id != AnonymousUser():
            try:
                user_data = self.scope['user_data']
                self.player = await self.create_player(user_data,user_id)
                await self.accept()
                if not self.player.isactive:
                    logger.error(f"Player {self.player.id} added to the matchmaking queue.")
                    await self.add_player_to_queue()
                    self.player.isactive = True
                    await sync_to_async(self.player.save)()
                    await self.channel_layer.group_add(
                        f'player_{self.player.id}',
                        self.channel_name
                    )
            except Exception as e:
                logger.error(f"Error in connect: {e}")
                await self.close()
        else:
            logger.warning("Anonymous user attempted to connect.")
            await self.close()

    async def disconnect(self, close_code):
        if self.scope["user"] != AnonymousUser() and getattr(self, 'player', None) and self.player.isactive:
            try:
                self.player.isactive = False
                await sync_to_async(self.player.save)()
                await self.remove_player_from_queue()
                logger.error(f"Player {self.player.id} disconnected and removed from the queue.")
                await self.channel_layer.group_discard(
                    f'player_{self.player.id}',
                    self.channel_name
                )
            except Exception as e:
                logger.error(f"Error in disconnect: {e}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)

            if data['message'] == 'Enter Queue':
                opponent_id = await self.find_opponent()
                if opponent_id is not None and int(opponent_id) != self.player.id:
                    try:
                        opponent = await sync_to_async(Player.objects.get)(id=int(opponent_id))
                        await self.start_game(opponent)
                        await self.close()
                    except Player.DoesNotExist:
                        await self.send(text_data=json.dumps({
                            'status': 'error',
                            'message': 'Opponent not found.',
                        }))
                else:
                    await self.add_player_to_queue()
                    await self.send_waiting_status()
        except json.JSONDecodeError:
            logger.error("Failed to decode JSON in receive method.")
            await self.send(text_data=json.dumps({
                'status': 'error',
                'message': 'Invalid JSON data.',
            }))
        except Exception as e:
            logger.error(f"Error in receive: {e}")
            await self.send(text_data=json.dumps({
                'status': 'error',
                'message': 'An error occurred while processing your request.',
            }))

    
    async def create_player(self, user_data,user_id):
        user_id = user_data.get('user_id')
        username = user_data.get('username')
        try:
            player = await sync_to_async(Player.objects.get)(username=username)
        except Player.DoesNotExist:
            player = await sync_to_async(Player.objects.get_or_create)(
                username=username,
                id=user_id,
                isactive = False
            )
        return player
    
    async def match_found(self, event):
        try:
            await self.send_match_found(event['room_name'], event['opponent'])
        except Exception as e:
            logger.error(f"Error in match_found: {e}")

    async def add_player_to_queue(self):
        async with queue_lock:
            if self.player.id not in matchmaking_queue:
                matchmaking_queue.append(self.player.id)
                logger.error(f"Player {self.player.id} added to the queue. Current queue: {matchmaking_queue}")

    async def remove_player_from_queue(self):
        async with queue_lock:
            if self.player.id in matchmaking_queue:
                matchmaking_queue.remove(self.player.id)
                logger.error(f"Player {self.player.id} removed from the queue. Current queue: {matchmaking_queue}")

    async def find_opponent(self):
        async with queue_lock:
            if matchmaking_queue :
                opponent_id = matchmaking_queue.popleft()
                logger.error(f"Found opponent {opponent_id} for player {self.player.id}.")
                return opponent_id
            return None

    async def start_game(self, opponent):
        try:
            room_name = make_key(20)
            game_room = await sync_to_async(GameRoom.objects.create)(
                room_name=room_name,
                player1=self.player,
                player2=opponent
            )

            self.player.isactive = False
            opponent.isactive = False
            await sync_to_async(self.player.save)()
            await sync_to_async(opponent.save)()

            opponent_data = PlayerSerializer(opponent).data
            player_data = PlayerSerializer(self.player).data
            await self.send_match_found(room_name, opponent_data)

           
            
            logger.error(f"Sending match found event to group 'player_{opponent.id}'")
            await self.channel_layer.group_send(
                f'player_{opponent.id}',
                {
                    'type': 'match.found',
                    'room_name': room_name,
                    'opponent': player_data,
                }
            )
            logger.error(f"Match found event sent to group 'player_{opponent.id}'")
            logger.error(f"Game started between Player {self.player.id} and Player {opponent.id} in room {room_name}.")
        except Exception as e:
            logger.error(f"Error in start_game: {e}")
            await self.send(text_data=json.dumps({
                'status': 'error',
                'message': 'Failed to start the game.',
            }))

    async def send_match_found(self, room_name, opponent_data):
        try:
            self.scope['opponent_data'] = opponent_data
            logger.error(f"{self.scope['opponent_data']}") 
            await self.send(text_data=json.dumps({
                'status': 'match_found',
                'room_name': room_name,
                'opponent': opponent_data,
                'player': PlayerSerializer(self.player).data,
                'time': 'stop',
                'game': 'start',
            }))
            logger.error(f"Match found: Player {self.player.id} vs Opponent {opponent_data['id']} in room {room_name}.")
        except Exception as e:
            logger.error(f"Error in send_match_found: {e}")

    async def send_waiting_status(self):
        try:
            await self.send(text_data=json.dumps({
                'status': 'waiting',
                'player': PlayerSerializer(self.player).data,
            }))
            logger.error(f"Player {self.player.id} is waiting for an opponent.")
        except Exception as e:
            logger.error(f"Error in send_waiting_status: {e}")
