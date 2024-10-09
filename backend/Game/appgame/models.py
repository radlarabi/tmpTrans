from django.db import models
from django.utils import timezone
from datetime import datetime , time

import logging
logger = logging.getLogger(__name__)
class Player(models.Model):
    username = models.CharField(max_length=20, unique=True, blank=False, null=False)
    wins = models.IntegerField(default=0)
    losts = models.IntegerField(default=0)
    isactive = models.BooleanField(default=False)
    avatar = models.CharField(max_length=255, default='/assets/images/default.webp')
    
    # New fields for remote gameplay and tournament participation
    is_remote = models.BooleanField(default=False)  
    current_tournament = models.ForeignKey('Tournament', on_delete=models.SET_NULL, null=True, blank=True)
    total_tournaments_played = models.IntegerField(default=0)  
    
    def __str__(self):
        return str(self.username)
    
    def is_in_tournament(self):
        return self.tournaments.filter(is_active=True).exists()


class GameRoom(models.Model):
	room_name = models.CharField(max_length=255, unique=True)
	player1 = models.ForeignKey(Player, related_name='player1_games', on_delete=models.CASCADE, null=True)
	player2 = models.ForeignKey(Player, related_name='player2_games', on_delete=models.CASCADE, null=True)
	score1 = models.IntegerField(default=0)
	score2 = models.IntegerField(default=0)
	game_date_time = models.DateTimeField(auto_now_add=True)
	
 	
	def __str__(self):
		return str(self.game_id)
	

class MatchmakingQueue(models.Model):
	player = models.ForeignKey(Player, on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now_add=True)
 
class GameHistory(models.Model):
    player = models.CharField(max_length=255)
    opponent = models.CharField(max_length=255)
    user_status = models.CharField(max_length=255)
    score = models.JSONField()  # Store as {"left": 0, "right": 0}
    game_date = models.DateTimeField(auto_now_add=True)


# Tournament Model
class Tournament(models.Model):
    name = models.CharField(max_length=100, unique=True)
    start_date = models.DateTimeField()  # Changed to DateTimeField
    end_date = models.DateTimeField()  # Changed to DateTimeField
    participants = models.ManyToManyField(Player, related_name='tournaments')
    is_active = models.BooleanField(default=True)
    start = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
    def is_expired(self):
        now = timezone.now().replace(second=0, microsecond=0)
        end_hours = self.end_date.hour
        end_minutes = self.end_date.minute
        end_datetime = timezone.make_aware(datetime.combine(self.end_date, time(end_hours, end_minutes)))
        logger.error(f"time now {now} end time {end_datetime}.")
        return now > end_datetime

    def is_arrived(self):
        now = timezone.now().replace(second=0, microsecond=0)
        start_hours = self.start_date.hour
        start_minutes = self.start_date.minute
        start_datetime = timezone.make_aware(datetime.combine(self.end_date, time(start_hours, start_minutes)))
        # logger.error(f"time now {now} end time {end_datetime}.")
        return start_datetime > now
        

class Match(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches')
    player1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='match_player1')
    player2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='match_player2')
    winner = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='match_winner', null=True, blank=True)
    room_name = models.CharField(max_length=255, unique=True)
    round_number = models.IntegerField()
    match_date = models.DateTimeField(auto_now_add=True)
    is_final = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.player1.username} vs {self.player2.username} - Round {self.round_number}'


# Leaderboard Model
class Leaderboard(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    fastest_win_time = models.DurationField(null=True, blank=True) 
    highest_score = models.IntegerField(default=0)

    def __str__(self):
        return f'Leaderboard for {self.player.username}'