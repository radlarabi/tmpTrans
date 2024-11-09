from rest_framework import serializers
from .models import Player, Tournament, Match, GameHistory, Leaderboard
from django.utils import timezone
class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'

class TournamentSerializer(serializers.ModelSerializer):
    
    start_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    end_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")

    class Meta:
        model = Tournament
        fields = ['id', 'name', 'start_date', 'end_date']
    
    def validate(self, data):
        print(f"----{data}-----",flush=True)
        if data['start_date'] >= data['end_date']:
            raise serializers.ValidationError("The start date must be before the end date.")
        if data['start_date'] < timezone.now():
            print(f"--{data}--[{timezone.now()}]--",flush=True)
            raise serializers.ValidationError("The start date must be in the future.")
        return data

class MatchSerializer(serializers.ModelSerializer):
    player1 = PlayerSerializer()
    player2 = PlayerSerializer()
    winner = PlayerSerializer()

    class Meta:
        model = Match
        fields = ['id', 'tournament', 'player1', 'player2', 'winner', 'round_number', 'match_date','room_name']

class GameHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GameHistory
        fields = ['id', 'player', 'opponent', 'user_status', 'score', 'game_date']

class LeaderboardSerializer(serializers.ModelSerializer):
    player = PlayerSerializer()

    class Meta:
        model = Leaderboard
        fields = ['id', 'player', 'wins', 'losses', 'fastest_win_time', 'highest_score']
