from django.urls import path
from .views import (
  login,
  logout,
  register_user, 
  get_user,
  refresh_Token,
  request_password_reset_email, # New API view for requesting reset
  password_reset_confirm        # New API view for confirming reset
)

urlpatterns = [
  path('token/refresh/', refresh_Token, name='token_refresh'),
  path('login/', login, name='login'),
  path('logout/', logout, name='logout'),
  path('get_user/', get_user, name='get_user'),
  path('register/', register_user, name='register_user'),

  
  path('password_reset/', request_password_reset_email, name='password_reset'),
  path('password_reset_confirm/<uidb64>/<token>/', password_reset_confirm, name='password_reset_confirm'),
]