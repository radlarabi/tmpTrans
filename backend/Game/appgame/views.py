from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, status
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from .utils import pair_players, make_key
from .models import GameRoom, Player, Tournament, Match, GameHistory, Leaderboard
from .serializer import PlayerSerializer, TournamentSerializer, MatchSerializer, GameHistorySerializer, LeaderboardSerializer
import logging
from django.db import models
logger = logging.getLogger(__name__)
# Create your views here.
def start_game():
    pass

class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
@permission_classes([IsAuthenticated])
class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    lookup_field = 'name' 
    
    def get_queryset(self):
        return super().get_queryset()  # Default behavior

    @action(detail=False, methods=['get'])
    def categorize_tournaments(self, request):
        
        queryset = self.get_queryset()

        active_tournaments = []  
        expired_tournaments = [] 

        for tournament in queryset:
            if tournament.is_expired():
                expired_tournaments.append(tournament.name)  
            else:
                active_tournaments.append(tournament.name)

        return Response({
            "active_tournaments": active_tournaments,
            "expired_tournaments": expired_tournaments,
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], url_path='register')
    def register(self, request, name=None):
        try:
            tournament = self.get_object()
            if tournament.is_expired():
                return Response({"error": "Tournament is expired."}, 
                                status=status.HTTP_400_BAD_REQUEST)
            player = Player.objects.get(username=request.data['username'])

            if player.is_in_tournament():
                return Response({"error": "Player is already part of an active tournament."}, 
                                status=status.HTTP_400_BAD_REQUEST)

            if tournament.participants.count() >= 4:
                # tournament.participants.remove(player)
                return Response({"error": "Tournament is full. Only 4 participants are allowed."}, 
                                status=status.HTTP_400_BAD_REQUEST)
            tournament.participants.add(player)
            logger.info(f"Player {player.username} registered for tournament {tournament.name}.")
            return Response({"message": f"Player {player.username} registered successfully."}, 
                            status=status.HTTP_200_OK)
            
        except Player.DoesNotExist:
            logger.error(f"Player with id {request.data['player_id']} not found.")
            return Response({"error": "Player not found."}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            logger.error(f"Error during player registration: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='start')
    def start(self, request, name=None):
        try:
            tournament = self.get_object()
            if tournament.is_expired():
                return Response({"error": "Tournament is expired."}, 
                                status=status.HTTP_400_BAD_REQUEST)
            if tournament.is_arrived():
                return Response({"error": "The start date has not yet arrived."}, 
                                status=status.HTTP_400_BAD_REQUEST)
            if tournament.participants.count() != 4:
                return Response({"error": "Not enough participants to start the tournament."}, 
                                status=status.HTTP_400_BAD_REQUEST)
            if tournament.start:
                return Response({"error": "Tournament has already started."}, 
                status=status.HTTP_400_BAD_REQUEST)
            # Start the tournament
            tournament.start = True
            tournament.save()

            participants = list(tournament.participants.all())
            pairs = pair_players(participants)

            for player1, player2 in pairs:
                Match.objects.create(
                    tournament=tournament,
                    player1=player1,
                    player2=player2,
                    room_name=make_key(20),
                    round_number=1
                )
            logger.info(f"Tournament {tournament.name} started successfully.")
            return Response({"message": f"Tournament {tournament.name} started successfully."}, 
                            status=status.HTTP_200_OK)
        except Tournament.DoesNotExist:
            logger.error(f"Tournament with id {name} not found.")
            return Response({"error": "Tournament not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error starting tournament: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=True, methods=['post'], url_path='next_round')
    def next_round(self, request, name=None):
        try:
            tournament = self.get_object()
            current_round = Match.objects.filter(tournament=tournament).aggregate(models.Max('round_number'))['round_number__max']

            if current_round is None:
                return Response({"error": "No matches found for this tournament."}, status=status.HTTP_400_BAD_REQUEST)

            current_round_matches = Match.objects.filter(tournament=tournament, round_number=current_round)

            # Check if all matches in the current round have winners
            if current_round_matches.filter(winner__isnull=True).exists():
                return Response({"error": "Not all matches have been completed for the current round."}, status=status.HTTP_400_BAD_REQUEST)

            # Get the list of winners from the current round
            winners = [match.winner for match in current_round_matches]
            if len(winners) == 2:
                final_match = Match.objects.create(
                    tournament=tournament,
                    player1=winners[0],
                    player2=winners[1],
                    room_name=make_key(20),
                    round_number=current_round + 1,
                    is_final=True
                )
                return Response(
                    {
                        "message": "Final match created.", 
                        "round_number": current_round + 1
                    }, 
                    status=status.HTTP_200_OK)

            return Response(
                {   
                    "message": f"Round {current_round + 1} matches created.", 
                    "round_number": current_round + 1
                }, 
                status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
@permission_classes([IsAuthenticated])
class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer

    @action(detail=True, methods=['post'], url_path='submit_result')
    def submit_result(self, request, pk=None):
        try:
            match = self.get_object()
            winner_username = request.data.get('winner_username')

            if not winner_username:
                return Response({"error": "Winner username is required."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                winner = Player.objects.get(username=winner_username)
            except Player.DoesNotExist:
                return Response({"error": "Player not found."}, status=status.HTTP_404_NOT_FOUND)

            if winner != match.player1 and winner != match.player2:
                return Response({"error": "Player is not part of this match."}, status=status.HTTP_400_BAD_REQUEST)

            if match.winner is not None:
                return Response({"error": "Match result has already been submitted."}, status=status.HTTP_400_BAD_REQUEST)
            match.winner = winner
            match.save()

            return Response({"message": "Match result submitted successfully."}, status=status.HTTP_200_OK)
        except Match.DoesNotExist:
            return Response({"error": "Match not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
class PlayerHistoryView(APIView):
    def get(self, request, *args, **kwargs):
        query_params = request.GET
        try: 
            if query_params and query_params['username']:
                logger.error(f"\n\n\n-----{query_params['username']}----")
                user = query_params['username']
                game_history = GameHistory.objects.filter(player=user).order_by('-game_date')
                history_data = [
                    {
                        'player1': user,
                        'palyer2': record.opponent,
                        'user_status': record.user_status,
                        'score': record.score,
                        'game_date': record.game_date.strftime("%Y-%m-%d %H:%M:%S")
                    }
                    for record in game_history
                ]
                if not game_history:
                    return Response({'error':'user not fond'},status=401)
                return Response({'game_history': history_data})
        except Exception as e:
            return Response({'error':f'error in key{e}'},status=401)
        return Response({'error':'user not fond'},status=401)
