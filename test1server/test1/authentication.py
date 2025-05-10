from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings

class JWTCookieAuthentication(JWTAuthentication):
    """
    An authentication backend that authenticates users with a JWT cookie.
    """
    def authenticate(self, request):
      cookie_name = getattr(settings, 'SIMPLE_JWT', {}).get('AUTH_COOKIE_ACCESS', 'access_token')
      raw_token = request.COOKIES.get(cookie_name)
      if raw_token is None:
        return None

      try:
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token
      except Exception as e:
        # Consider logging the exception e here if needed
        return None # Authentication failed