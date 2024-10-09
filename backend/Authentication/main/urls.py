from django.urls import path
from .views import (
	CustomUserUpdateAPIView, UserUpdatePasswordAPIView, UserDetailsView, DeleteUserAccountView,
	AddFriendView, AddRequestView, ListFriendDetailsView, BlockFriendView, UnblockFriendView, FriendsListView,
	RemoveFriendView, GetUsersListView, NewGame
)

# start crud
urlpatterns = [
	path('edit/', CustomUserUpdateAPIView.as_view(), name='EditProfile'), # checked
	path('edit/password/', UserUpdatePasswordAPIView.as_view(), name='EditPassword'), # checked
	path('details/', UserDetailsView.as_view(), name='ListUserDetails'), # checked
	path('deleteAccount/', DeleteUserAccountView.as_view(), name='DeleteAccount'), # checked
	path('friend/add/', AddFriendView.as_view(), name='AddFriend'), # checked
	path('friends-list/', FriendsListView.as_view(), name='listOfFriends'), # checked
	path('friend/unfriend/', RemoveFriendView.as_view(), name='listOfFriends'), # checked
	path('friend/block/', BlockFriendView.as_view(), name='BlockFriend'), # checked
	path('friend/unblock/', UnblockFriendView.as_view(), name='UnblockFriend'), # checked
	path('usersList/', GetUsersListView.as_view(), name='UsersList'),
	path('newGame/', NewGame.as_view(), name='NewGame'),
	# path('pendingRequest/add/', AddRequestView.as_view(), name='AddRequest'),
	path('<str:username>/', ListFriendDetailsView.as_view(), name='ListFriendDetails')
]


