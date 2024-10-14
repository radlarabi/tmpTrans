import json
import asyncio
import logging
from channels.generic.websocket import AsyncWebsocketConsumer

logger = logging.getLogger(__name__)

class LocalConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.game_group_id = f"game_{self.game_id}"
        await self.channel_layer.group_add(self.game_group_id, self.channel_name)
        await self.accept()

        logger.info(f"Connected to game: {self.game_group_id}")

        # Initialize game state
        self.game_state = {
            'left': {'x': 30, 'y': 40, 'width': 15, 'height': 85, 'score': 0},
            'right': {'x': 760, 'y': 30, 'width': 15, 'height': 85, 'score': 0},
            'ball': {'x': 50, 'y': 50, 'dx': 1, 'dy': 1},
            'canvas': {'width': 800, 'height': 400}
        }

        # Start game loop
        self.game_task = asyncio.create_task(self.game_loop())

    async def disconnect(self, close_code):
        logger.info(f"Disconnected from game: {self.game_group_id} (code: {close_code})")
        if hasattr(self, 'game_task'):
            self.game_task.cancel()
        await self.channel_layer.group_discard(self.game_group_id, self.channel_name)

    async def receive(self, text_data):
        logger.info(f"Received data: {text_data}")
        data = json.loads(text_data)
        event = data.get('event')

        if event == 'move':
            await self.handle_player_movement(data)  # Await the movement handler
        elif event == 'reset_game':
            await self.reset_game()

    async def handle_player_movement(self, data):
        player = data.get('player')  # 'left' or 'right'
        movement = data.get('move')  # 'up' or 'down'
        
        if player and movement in ['up', 'down']:
            if movement == 'up':
                self.game_state[player]['y'] -= 10 # Move up
                if self.game_state[player]['y'] < 0:
                    self.game_state[player]['y'] = 0
            elif movement == 'down':
                self.game_state[player]['y'] += 10
                if self.game_state[player]['y'] +  self.game_state[player]['height'] > 400:
                    self.game_state[player]['y'] = 400 - self.game_state[player]['height'] # Move down

            logger.info(f"Updated {player} position: {self.game_state[player]['y']}")
            await self.send_game_update()  # Ensure this is awaited

    async def reset_game(self):
        self.game_state['left']['score'] = 0
        self.game_state['right']['score'] = 0
        self.game_state['ball']['x'] = 50
        self.game_state['ball']['y'] = 50
        logger.info("Game reset")
        await self.send_game_update()  # Send updated state after reset

    async def game_loop(self):
        while True:
            await asyncio.sleep(0.004)  # Control the loop speed ff
            self.update_ball_position()
            await self.send_game_update()

    def update_ball_position(self):
        ball = self.game_state['ball']
        canvas = self.game_state['canvas']
        left_paddle = self.game_state['left']
        right_paddle = self.game_state['right']
        
        ball['x'] += ball['dx']
        ball['y'] += ball['dy']

        # Ball bounce logic
        if ball['y'] <= 0 or ball['y'] >= canvas['height']:
            ball['dy'] *= -1

        if ball['x'] <= 0 or ball['x'] >= canvas['width']:
            ball['dx'] *= -1
        
        if ball['dx'] < 0 and left_paddle['x'] < ball['x'] < left_paddle['x'] + left_paddle['width']:
            if left_paddle['y'] < ball['y'] < left_paddle['y'] + left_paddle['height']:
                ball['dx'] = -ball['dx']
        
        
        if ball['dx'] > 0 and right_paddle['x'] < ball['x'] < right_paddle['x'] + right_paddle['width']:
            if right_paddle['y'] < ball['y'] < right_paddle['y'] + right_paddle['height']:
                ball['dx'] = -ball['dx']
        # Ball goes out of bounds (scoring logic can be added here)
        if ball['x'] <= 0:
            self.game_state['right']['score'] += 1
            self.reset_ball_position()
        elif ball['x'] >= canvas['width']:
            self.game_state['left']['score'] += 1
            self.reset_ball_position()

    def reset_ball_position(self):
        ball = self.game_state['ball']
        ball['x'] = self.game_state['canvas']['width'] / 2
        ball['y'] = self.game_state['canvas']['height'] / 2
        ball['dx'] = 1  
        ball['dy'] = 1


    async def send_game_update(self):
        logger.info("Sending game update...")
        await self.channel_layer.group_send(
            self.game_group_id,
            {
                'type': 'game_update',
                'player': self.game_state['left'],
                'opponent': self.game_state['right'],
                'ball': self.game_state['ball'],
                'canvas': self.game_state['canvas'],
            }
        )

    async def game_update(self, event):
        await self.send(text_data=json.dumps(event))
