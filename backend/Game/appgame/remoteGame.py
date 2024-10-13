import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import GameHistory
import asyncio
import logging
from django.utils import timezone
logger = logging.getLogger(__name__)
class RemoteConsumer(AsyncWebsocketConsumer):
    rooms = {}  # Dictionary to hold the game state and loop task for each room
    opponent = None
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.username = self.scope["user_data"]["username"]
        logger.error(f"\n\n{self.scope["opponent_data"]}\n\n")
        self.room_group_name = f"game_{self.room_name}"
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.channel_layer.group_add(
            self.username,
            self.channel_name
        )

        await self.accept()

        if self.room_group_name not in RemoteConsumer.rooms:
            RemoteConsumer.rooms[self.room_group_name] = {
                'game_state': self.initialize_game_state(),
                'game_loop_task': None,
                'active_connections': 0
            }

        room = RemoteConsumer.rooms[self.room_group_name]
        room['active_connections'] += 1

        self.player_side = 'left' if room['active_connections'] == 1 else 'right'

        if not room['game_loop_task']:
            room['game_loop_task'] = asyncio.create_task(self.game_loop(self.room_group_name))
 
    
    async def set_opponent(self, opponent):
        logger.error("seting")
        self.opponent = opponent
        
    async def get_opponent(self):
        logger.error("geting")
        return self.opponent
    
    async def disconnect(self, close_code):
        room = RemoteConsumer.rooms[self.room_group_name]
        room['active_connections'] -= 1

        if room['active_connections'] < 2:
            room['game_loop_task'].cancel()

            opponent = await self.get_opponent()
            
            # Send message to frontend that a player has left the game
            leave_message = {
                'type': 'player_left',
                'message': 'A player has left the game.'
            }
            
            logger.error(f"------1---\n\n\n{opponent}\n\n\n-----1-----")
            if opponent:
                
                await self.channel_layer.group_send(
                    opponent,
                    {
                        'type': 'game.message',
                        'message': leave_message
                    }
                )
            
            try:
                await room['game_loop_task']
            except asyncio.CancelledError:
                pass
            del RemoteConsumer.rooms[self.room_group_name]

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        await self.channel_layer.group_discard(
            self.username,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        self.oppenet = data.get('oppenet')
        await self.set_opponent(self.oppenet)
        logger.error(f"\n\n\n---------op----------------{data}-----------------------------\n\n\n")
        if action == 'move_paddle':
            direction = data['direction']
            player_paddle = 'left' if self.player_side == 'left' else 'right'
            if direction == 'up':
                RemoteConsumer.rooms[self.room_group_name]['game_state']['paddles'][player_paddle]['vy'] = -5
            elif direction == 'down':
                RemoteConsumer.rooms[self.room_group_name]['game_state']['paddles'][player_paddle]['vy'] = 5
            elif direction == 'stop':
                RemoteConsumer.rooms[self.room_group_name]['game_state']['paddles'][player_paddle]['vy'] = 0
        elif action == 'game_over':
            self.oppenet = data.get('oppenet')
            await self.handle_game_over()

    async def handle_game_over(self):
        room = RemoteConsumer.rooms[self.room_group_name]
        game_state = room['game_state']
        player2 = self.oppenet
        # self.set_opponent(self.oppenet)
        if game_state['score']['left'] >= 5:
            winner = 'left'
            loser = 'right'   
        else:
            winner = 'right'
            loser = 'left'
            
        user_status = 'win' if self.player_side == winner else 'lose'

        if self.player_side == 'left':
            user_score = game_state['score']['left']
            opponent_score = game_state['score']['right']
        else:
            user_score = game_state['score']['right']
            opponent_score = game_state['score']['left']

        await database_sync_to_async(GameHistory.objects.create)(
            player=self.username, 
            opponent=player2,
            user_status=user_status,
            score={'score1': user_score, 'score2': opponent_score}, 
            game_date=timezone.now()
        )

        try:
            await self.channel_layer.group_send(
                self.username,
                {
                    'type': 'game_over',
                    'message': 'Game Over!',
                    'player1': self.username,
                    'player2': player2,
                    'winner': winner,
                    'loser': loser,
                    'user_status': user_status,
                    'score': {'left': user_score, 'right': opponent_score}
                }
            )
        except Exception as e:
            logger.error(f"Error sending game over message to {self.username}: {e}")



    async def game_loop(self, room_group_name):
        try:
            while True:
                self.update_game_state(room_group_name)
                await self.channel_layer.group_send(
                    room_group_name,
                    {
                        'type': 'update_state',
                        'room_group_name': room_group_name
                    }
                )
                await asyncio.sleep(0.015)
        except asyncio.CancelledError:
            pass

    def update_game_state(self, room_group_name):
        room = RemoteConsumer.rooms[room_group_name]
        game_state = room['game_state']
        ball = game_state['ball']
        ball['x'] += ball['vx']
        ball['y'] += ball['vy']

        if ball['y'] - ball['radius'] <= 0 or ball['y'] + ball['radius'] >= 400:
            ball['vy'] = -ball['vy']

        left_paddle = game_state['paddles']['left']
        right_paddle = game_state['paddles']['right']

        if ball['vx'] < 0 and left_paddle['x'] < ball['x'] < left_paddle['x'] + left_paddle['width']:
            if left_paddle['y'] < ball['y'] < left_paddle['y'] + left_paddle['height']:
                ball['vx'] = -ball['vx']

        if ball['vx'] > 0 and right_paddle['x'] < ball['x'] < right_paddle['x'] + right_paddle['width']:
            if right_paddle['y'] < ball['y'] < right_paddle['y'] + right_paddle['height']:
                ball['vx'] = -ball['vx']

        for paddle in game_state['paddles'].values():
            paddle['y'] += paddle['vy']
            if paddle['y'] < 0:
                paddle['y'] = 0
            if paddle['y'] + paddle['height'] > 400:
                paddle['y'] = 400 - paddle['height']

        # if game_state['score']['left'] >= 5 or game_state['score']['right'] >= 5:
        #     asyncio.create_task(self.handle_game_over())  # Handle game over asynchronously
        #     return

        if ball['x'] < 0:
            game_state['score']['right'] += 1
            self.reset_ball(room_group_name)
        elif ball['x'] > 800:
            game_state['score']['left'] += 1
            self.reset_ball(room_group_name)

    def reset_ball(self, room_group_name):
        room = RemoteConsumer.rooms[room_group_name]
        ball = room['game_state']['ball']
        ball['x'] = 400
        ball['y'] = 200
        ball['vx'] = -ball['vx']
        ball['vy'] = 4

    def initialize_game_state(self):
        return {
            'ball': {'x': 400, 'y': 200, 'vx': 4, 'vy': 4, 'radius': 8},
            'paddles': {
                'left': {'x': 30, 'y': 150, 'width': 15, 'height': 85, 'vy': 0},
                'right': {'x': 760, 'y': 150, 'width': 15, 'height': 85, 'vy': 0}
            },
            'score': {'left': 0, 'right': 0}
        }

    async def update_state(self, event):
        room_group_name = event['room_group_name']
        game_state = RemoteConsumer.rooms[room_group_name]['game_state']
        if self.player_side == 'right':
            mirrored_game_state = self.mirror_game_state(game_state)
            await self.send(text_data=json.dumps({
                'game_state': mirrored_game_state
            }))
        else:
            await self.send(text_data=json.dumps({
                'game_state': game_state
            }))

    def mirror_game_state(self, game_state):
        mirrored_state = json.loads(json.dumps(game_state))  # Deep copy
        mirrored_state['ball']['x'] = 800 - game_state['ball']['x']
        mirrored_state['ball']['vx'] = -game_state['ball']['vx']
        mirrored_state['paddles']['left']['y'] = game_state['paddles']['right']['y']
        mirrored_state['paddles']['right']['y'] = game_state['paddles']['left']['y']
        mirrored_state['score']['left'] = game_state['score']['right']
        mirrored_state['score']['right'] = game_state['score']['left']
        return mirrored_state
    
    async def game_over(self, event):
        message = event['message']
        player1 = event['player1']
        player2 = event['player2']
        
        user_status = event['user_status']
        score = event['score']
        

        await self.send(text_data=json.dumps({
            'game_over': True,
            'message': message,
            'player1': player1,
            'player2': player2,
            'user_status': user_status,
            'score': score
        }))
        room = RemoteConsumer.rooms[self.room_group_name]
        room['game_loop_task'].cancel()
        # await self.close()
    async def game_message(self, event):
        message = event['message']
        logger.error(f"left form game")
        # Send the message to WebSocket client
        await self.send(text_data=json.dumps({
            'type': 'game.message',
            'message': message
        }))