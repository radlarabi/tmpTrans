import logging , json
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from asgiref.sync import sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
import requests
logger = logging.getLogger(__name__)

@sync_to_async
def get_user_from_jwt(token):
    try:
        access_token = AccessToken(token)
        user_id = access_token['user_id']
        return {'user_id': user_id}
    except TokenError as e:
        logger.error(f"Token validation error: {e}")
        return AnonymousUser()


@sync_to_async
def get_data_user_form_api(token):
    try:
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        response = requests.get("http://auth:8000/api/profile/details/",headers=headers)
        if response.status_code == 200:
            res = json.loads(response.text)
            return res
        else:
            return None;
    except Exception as e:
        logger.error(f" errors of --> {e}")

class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        headers = dict(scope["headers"])
        try:
            cookie_header = headers.get(b"cookie", b"").decode()
            token = None

            cookies = [cookie.strip() for cookie in cookie_header.split(';')]
            for cookie in cookies:
                if cookie.startswith('Authorization='):
                    token = cookie[len('Authorization='):].strip()
                    break
            if token:
                if token.startswith('Bearer '):
                    token = token[len('Bearer '):].strip()
                scope['user'] = await get_user_from_jwt(token)
                scope['user_data'] = await get_data_user_form_api(token)
                scope['opponent_data'] = {}
            else:
                scope['user'] = AnonymousUser()
        except Exception as e:
            logger.error(f"Error in TokenAuthMiddleware: {e}")
            scope['user'] = AnonymousUser()
        return await self.inner(scope, receive, send)
