from .serializers import UserSerializer
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

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
  email = request.data.get('email')
  password = request.data.get('password')
  user = authenticate(request, email=email, password=password)
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


