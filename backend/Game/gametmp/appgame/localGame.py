import json
import logging
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer

logger = logging.getLogger(__name__)

class LocalConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.game_group_id = f"game_{self.game_id}"
        await self.channel_layer.group_add(
            self.game_group_id,
            self.channel_name
        )
        await self.accept()
        self.game_state = None

    async def disconnect(self, close_code):
        self.game_task.cancel()
        await self.channel_layer.group_discard(
            self.game_group_id,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data.get('event')
        logger.error(f"----------{event}-----------")
        if  self.game_state is None and event == 'normal':
            self.game_state = {
                'ball': data.get('ball'),
                'player': data.get('player'),
                'opponent': data.get('opponent'),
                'canvas': data.get('canvas')
            }
            self.game_task = asyncio.create_task(self.game_loop())
        elif event == 'move':
            player = data.get('player')
            opponent = data.get('opponent')
            dirication = data.get('dirication')
            canvas = data.get('canvas')
            canvas_height = canvas.get('height')

            if dirication == 'left':
                player['y'] = self.update_player_position(player['y'], player['keys'], canvas_height, player['height'])
            elif dirication == 'right':
                opponent['y'] = self.update_player_position(opponent['y'], player['keys'], canvas_height, opponent['height'])

            self.game_state['player'] = player
            self.game_state['opponent'] = opponent
        elif event == 'resize':
            self.game_state['canvas'] = data.get('canvas', self.game_state['canvas'])
            self.game_state['player'] =data.get('player', self.game_state['player'])
            self.game_state['opponent'] =data.get('opponent', self.game_state['opponent'])
            self.game_state['ball'] = data.get('ball',self.game_state['ball'])
        elif event == 'reset_game':
            canvas_width = self.game_state['canvas']['width']
            canvas_height = self.game_state['canvas']['height']
            
            self.game_state['player']['score'] = 0
            self.game_state['opponent']['score'] = 0
            self.reset_ball(self.game_state['ball'], canvas_width, canvas_height)
            
           
            self.game_state['player']['y'] = canvas_height / 2 - self.game_state['player']['height'] / 2
            self.game_state['opponent']['y'] = canvas_height / 2 - self.game_state['opponent']['height'] / 2
            
            await self.channel_layer.group_send(
                self.game_group_id,
                {
                    'type': 'game_update',
                    'player': self.game_state['player'],
                    'opponent': self.game_state['opponent'],
                    'ball': self.game_state['ball'],
                    'canvas': self.game_state['canvas'],
                    'event': 'game_reset'
                }
            )
            self.game_task = asyncio.create_task(self.game_loop())
    async def game_loop(self):
        try:
            while True:
                self.game_state['ball'] = self.move_ball(
                    self.game_state['ball'],
                    self.game_state['canvas']['width'],
                    self.game_state['canvas']['height'],
                    self.game_state['player'],
                    self.game_state['opponent']
                )
                await self.channel_layer.group_send(
                    self.game_group_id,
                    {
                        'type': 'game_update',
                        'player': self.game_state['player'],
                        'opponent': self.game_state['opponent'],
                        'ball': self.game_state['ball'],
                        'canvas': self.game_state['canvas']
                    }
                )
                await asyncio.sleep(1 / 60)
        except Exception as e:
            logger.error(f"loop exeception {e}")

    async def game_update(self, event):
        await self.send(text_data=json.dumps(event))

    def update_player_position(self, y, keys, canvas_height, player_height):
        move_speed = 20
        if keys.get('ArrowUp') or keys.get('w'):
            y = max(0, y - move_speed)
        if keys.get('ArrowDown') or keys.get('s'):
            y = min(canvas_height - player_height, y + move_speed)
        return y

    def move_ball(self, ball, canvas_width, canvas_height, player, opponent):
        ball['x'] += ball['velocity_x']
        ball['y'] += ball['velocity_y']

        if ball['y'] <= 0 or ball['y'] >= canvas_height - ball['size']:
            ball['velocity_y'] *= -1

        if self.ball_hits_paddle(ball, player):
            ball['velocity_x'] *= -1
            ball = self.adjust_ball_angle(ball, player)
        elif self.ball_hits_paddle(ball, opponent):
            ball['velocity_x'] *= -1
            ball = self.adjust_ball_angle(ball, opponent)

        if ball['x'] <= 0:
            self.game_state['player']['score'] += 1
            if self.check_game_over():
                return ball
            self.reset_ball(ball, canvas_width, canvas_height, direction="right")
        elif ball['x'] >= canvas_width - ball['size']:
            self.game_state['opponent']['score'] += 1
            if self.check_game_over():
                return ball
            self.reset_ball(ball, canvas_width, canvas_height, direction="left")
        return ball

    def ball_hits_paddle(self, ball, paddle):
        return (ball['x'] <= paddle['x'] + paddle['width'] and
                ball['x'] + ball['size'] >= paddle['x'] and
                ball['y'] + ball['size'] >= paddle['y'] and
                ball['y'] <= paddle['y'] + paddle['height'])

    def adjust_ball_angle(self, ball, paddle):
        paddle_center = paddle['y'] + paddle['height'] / 2
        hit_pos = (ball['y'] - paddle_center) / (paddle['height'] / 2)
        max_angle = 0.5

        ball['velocity_y'] = hit_pos * max_angle * abs(ball['velocity_x'])
        return ball

    def reset_ball(self, ball, canvas_width, canvas_height, direction="right"):
        ball['x'] = canvas_width / 2 - ball['size'] / 2
        ball['y'] = canvas_height / 2 - ball['size'] / 2
        ball['velocity_x'] = 5 if direction == "right" else -5
        ball['velocity_y'] = 0

        return ball

    
    def check_game_over(self):
        if self.game_state['player']['score'] >= 5:
            asyncio.create_task(self.end_game(f"{self.game_state['player']['username']}"))
            return True
        elif self.game_state['opponent']['score'] >= 5:
            asyncio.create_task(self.end_game(f"{self.game_state['opponent']['username']}"))
            return True
        return False
    
    
    async def end_game(self, winner_message):
        await self.channel_layer.group_send(
            self.game_group_id,
            {
                'type': 'game_over',
                'message': winner_message,
                'player': self.game_state['player'],
                'opponent': self.game_state['opponent']
            }
        )
        self.game_task.cancel()  
    
    
    async def game_over(self, event):
        await self.send(text_data=json.dumps({
            'event': 'game_over',
            'message': event['message'],
            'player': self.game_state['player'],
            'opponent': self.game_state['opponent']
        }))
