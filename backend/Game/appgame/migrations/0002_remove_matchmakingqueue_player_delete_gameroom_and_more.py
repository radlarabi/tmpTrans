# Generated by Django 5.1 on 2024-09-01 19:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('appgame', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='matchmakingqueue',
            name='player',
        ),
        migrations.DeleteModel(
            name='GameRoom',
        ),
        migrations.DeleteModel(
            name='MatchmakingQueue',
        ),
        migrations.DeleteModel(
            name='Player',
        ),
    ]
