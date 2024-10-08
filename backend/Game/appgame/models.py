# from django.db import models

# class Game(models.Model):
# 	# game_id = models.AutoField(primary_key=True)
# 	game_date_time = models.DateTimeField(auto_now_add=True)
# 	players = models.ManyToManyField(CustomUser, through='Player_game')

# 	def __str__(self):
# 		return str(self.game_id)

# class Player_game(models.Model):
# 	username = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
# 	game = models.ForeignKey(Game, on_delete=models.CASCADE)
# 	score = models.PositiveIntegerField()

# 	class Meta:
# 		unique_together = ['username', 'game']

# 	def __str__(self):
# 		return str(self.game_id)
