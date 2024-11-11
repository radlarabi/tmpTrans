from channels.generic.websocket import AsyncWebsocketConsumer
import json

class TournamentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            tournament_name = self.scope['url_route']['kwargs'].get('tournament_name')
            if not tournament_name:
                print("--- Missing tournament_id in URL route ---", flush=True)
                await self.close()
                return

            self.group_name = f"tournament_{tournament_name}"

            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
        except Exception as e:
            print(f"--- Error during connection: {e} ---", flush=True)

    async def disconnect(self, close_code):
        try:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
        except Exception as e:
            print(f"--- Error during disconnection: {e} ---", flush=True)

    async def tournament_start(self, event):
        print(f"{event}",flush=True)
        message = event["message"]
        await self.send(text_data=json.dumps({"message": message}))
