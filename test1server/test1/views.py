from .serializers import (
  UserSerializer,
  PasswordResetSerializer,
  SetNewPasswordSerializer
)
from .models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_str
#from django.core.mail import send_mail
#from django.template.loader import render_to_string 

from django.conf import settings
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_Token(request):
  refresh_token_cookie_name = getattr(settings, 'SIMPLE_JWT', {}).get('AUTH_COOKIE_REFRESH', 'refresh_token')
  refresh_token = request.COOKIES.get(refresh_token_cookie_name)

  if not refresh_token:
      logger.warning("Refresh token cookie not found.")
      return Response({'error': 'Refresh token cookie not found.'}, status=401)

  try:
      # Use the RefreshToken object to verify and potentially blacklist the old token
      refresh = RefreshToken(refresh_token)
      # Verify the token (this will raise TokenError if invalid or blacklisted)
      refresh.verify()

      # Create response and set the new access token cookie
      response = Response({'message': 'Token refreshed successfully'})
      access_token_cookie_name = getattr(settings, 'SIMPLE_JWT', {}).get('AUTH_COOKIE_ACCESS', 'access_token')
      response.set_cookie(
          key=access_token_cookie_name,
          value=str(refresh.access_token),
          httponly=settings.SIMPLE_JWT.get('AUTH_COOKIE_HTTP_ONLY', True), # Use .get for safety
          secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', not settings.DEBUG),
          samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
          path=settings.SIMPLE_JWT.get('AUTH_COOKIE_PATH', '/')
      )
      # Since ROTATE_REFRESH_TOKENS is likely False in your settings now,
      # we don't get/set a new refresh token.
      logger.info("Token refreshed successfully via cookie.")
      return response

  except TokenError as e:
      logger.warning(f"Token refresh failed via cookie: {e}")
      # Clear potentially invalid cookies
      response = Response({'error': f'Invalid or expired refresh token: {e}'}, status=401)
      response.delete_cookie(refresh_token_cookie_name, path=settings.SIMPLE_JWT.get('AUTH_COOKIE_PATH', '/'))
      access_token_cookie_name = getattr(settings, 'SIMPLE_JWT', {}).get('AUTH_COOKIE_ACCESS', 'access_token')
      response.delete_cookie(access_token_cookie_name, path=settings.SIMPLE_JWT.get('AUTH_COOKIE_PATH', '/'))
      return response
  except Exception as e:
      logger.error(f"Unexpected error during token refresh: {e}", exc_info=True) # Log traceback for 500s
      return Response({'error': 'An unexpected error occurred during token refresh.'}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
  user = request.user
  serializer = UserSerializer(user)
  return Response(serializer.data, status=200)
  

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request, *args, **kwargs):
  try:
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=201)
    else:
      return Response(serializer.errors, status=400)
  except Exception as e:
    return Response({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
  username = request.data.get('username')
  password = request.data.get('password')
  user = authenticate(request, username=username, password=password)

  if user:
    refresh = RefreshToken.for_user(user)
    response = Response({'message': 'Login successful'})
    response.set_cookie(
      key='access_token',
      value=str(refresh.access_token),
      httponly=True,
      secure=True, # True in prod (HTTPS)
      samesite='None',
      path='/'
    )
    response.set_cookie(
      key='refresh_token',
      value=str(refresh),
      httponly=True,
      secure=True, # True in prod (HTTPS)
      samesite='None',
      path='/'
    )
    return response
  else:
    return Response({'error': 'Invalid credentials'}, status=400)
  

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
  response = Response({'message': 'Logout successful'})
  response.delete_cookie('access_token', path='/')
  response.delete_cookie('refresh_token', path='/')
  return response


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_password_reset_email(request):
  serializer = PasswordResetSerializer(data=request.data)
  if serializer.is_valid():
     email = serializer.validated_data['email']
     try:
        user = User.objects.get(email=email)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        #frontend_url = getattr(settings, 'FRONTEND_URL', 'https://test1-project.vercel.app') 
        frontend_url = getattr(settings, 'FRONTEND_URL', 'https://localhost:5173')
        reset_link = f"{frontend_url}/reset-password-confirm/{uidb64}/{token}/"
        
        subject = 'Password Reset Requested'
        reset_password_template = "password_reset_email.html"
        c = {
            "email": user.email,
            "domain": request.get_host(), # or your frontend domain
            "site_name": "Test1-Project",
            "uid": uidb64,
            "user": user,
            "token": token,
            "protocol": 'https' if not settings.DEBUG else 'http',
            "reset_link": reset_link,
        }
        #message = render_to_string(reset_password_template, c)
        message = f"Hello {user.username},\n\nPlease click the link below to reset your password:\n{reset_link}\n\nIf you did not request this, please ignore this email.\n\nThanks,\nThe Team"

        #Email Configuration: The request_password_reset_email view currently logs the reset link to your console/logger. For it to actually send emails, you'll need to configure Django's email settings in your settings.py file (e.g., EMAIL_BACKEND, EMAIL_HOST, EMAIL_PORT, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, etc.). Once configured, you can uncomment the send_mail line in views.py.
        # TODO: Configure email backend in settings.py and uncomment send_mail
        # send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
        #   logger.info(f"Password reset link for {user.email}: {reset_link} (Email sending is currently simulated)")
        # print(f"DEBUG: Password reset link for {user.email}: {reset_link}") # For local testing if email is not set up

        logger.info(f"Password reset link for {user.email}: {reset_link}")
        return Response({'message': 'If an account with this email, a password reset link will be sent.'}, status=200)
     except User.DoesNotExist:
        return Response({'message': 'If an account with this email exists, a password reset link has been sent.'}, status=200)
     except Exception as e:
        logger.error(f"Error sending password reset email: {e}", exc_info=True)
        return Response({'error': 'User with this email does not exist.'}, status=404)
  return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request, uidb64, token):
    serializer = SetNewPasswordSerializer(data=request.data, context={'uidb64': uidb64, 'token': token})
    if serializer.is_valid():
        user = serializer.validated_data['user']
        user.set_password(serializer.validated_data['password'])
        user.save()
        return Response({'message': 'Password has been reset successfully.'}, status=200)
    return Response(serializer.errors, status=400)