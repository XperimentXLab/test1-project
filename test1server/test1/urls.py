from django.urls import path
from .views import (
  login,
  logout,
  register_user, 
  get_user,
  refresh_Token
)

urlpatterns = [
  path('token/refresh/', refresh_Token, name='token_refresh'),
  path('login/', login, name='login'),
  path('logout/', logout, name='logout'),
  path('get_user/', get_user, name='get_user'),
  path('register/', register_user, name='register_user'),
]