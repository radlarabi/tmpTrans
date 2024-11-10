from rest_framework import serializers
from .models import Player, Tournament, Match, GameHistory, Leaderboard
from django.utils import timezone
from rest_framework.exceptions import ValidationError,PermissionDenied
import requests


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'

from rest_framework import serializers
from .models import Tournament
from django.utils import timezone
from rest_framework.exceptions import ValidationError
import requests

class TournamentSerializer(serializers.ModelSerializer):
    
    start_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    end_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")

    class Meta:
        model = Tournament
        fields = ['id', 'name', 'start_date', 'end_date']

    def __init__(self, *args, **kwargs):
        # Perform token validation before the fields are processed
        request = kwargs.get('context', {}).get('request', None)
        if request:
            token = request.headers.get('Authorization')
            if token:
                token = token.split(" ")[1]  # Extract the token
                if not self.is_token_valid(token):
                    raise PermissionDenied("Invalid or expired authorization token.")
            else:
                raise PermissionDenied("Authorization token is required.")
        
        super().__init__(*args, **kwargs)

    def is_token_valid(self, token):
        try:
            url = "http://auth:8000/api/profile/details/"
            headers = {'Authorization': f'Bearer {token}'}
            response = requests.get(url, headers=headers)
            return response.status_code == 200 
        except requests.exceptions.RequestException:
            return False 

    def validate(self, data):
        if data['start_date'] >= data['end_date']:
            raise serializers.ValidationError("The start date must be before the end date.")
        if data['start_date'] < timezone.now():
            raise serializers.ValidationError("The start date must be in the future.")

        return data


class MatchSerializer(serializers.ModelSerializer):
    player1 = PlayerSerializer()
    player2 = PlayerSerializer()
    winner = PlayerSerializer()

    class Meta:
        model = Match
        fields = ['id', 'tournament', 'player1', 'player2', 'winner', 'round_number', 'match_date','room_name']
    
    def __init__(self, *args, **kwargs):
        # Perform token validation before the fields are processed
        request = kwargs.get('context', {}).get('request', None)
        if request:
            token = request.headers.get('Authorization')
            if token:
                token = token.split(" ")[1]  # Extract the token
                if not self.is_token_valid(token):
                    raise PermissionDenied("Invalid or expired authorization token.")
            else:
                raise PermissionDenied("Authorization token is required.")
        
        super().__init__(*args, **kwargs)

    def is_token_valid(self, token):
        try:
            url = "http://auth:8000/api/profile/details/"
            headers = {'Authorization': f'Bearer {token}'}
            response = requests.get(url, headers=headers)
            return response.status_code == 200 
        except requests.exceptions.RequestException:
            return False 


class GameHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GameHistory
        fields = ['id', 'player', 'opponent', 'user_status', 'score', 'game_date']

class LeaderboardSerializer(serializers.ModelSerializer):
    player = PlayerSerializer()

    class Meta:
        model = Leaderboard
        fields = ['id', 'player', 'wins', 'losses', 'fastest_win_time', 'highest_score']
