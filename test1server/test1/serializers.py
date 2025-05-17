from rest_framework import serializers
from .models import User
import re 
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str

class UserSerializer(serializers.ModelSerializer):
  password = serializers.CharField(write_only=True, required=True)
  class Meta:
    model = User
    fields = ['id', 'ic', 'username', 'email', 'password']
    extra_kwargs = {'password': {'write_only': True}}

  def validate_email(self, value):
    if User.objects.filter(email=value).exists():
      raise serializers.ValidationError('Email already in use')
    return value
  
  def validate_ic(self, value):
    if User.objects.filter(ic=value).exists():
      raise serializers.ValidationError('IC already in use')
    return value
  
  def validate_username(self, value):
    if User.objects.filter(username=value).exists():
      raise serializers.ValidationError('Username already in use')
    return value
  
  def validate_wallet_address(self, value):
    if User.objects.filter(wallet_address=value).exists():
      raise serializers.ValidationError('Wallet address already in use')
    return value
  
  #password need to have at least 1 uppercase 1 lowercase and a number for 8 characters
  def validate_password(self, value):
    if len(value) < 8:
      raise serializers.ValidationError('Password must be at least 8 characters long')
    if not re.search(r"[a-z]", value):
      raise serializers.ValidationError('Password must contain at least one lowercase letter')
    if not re.search(r"[A-Z]", value):
      raise serializers.ValidationError('Password must contain at least one uppercase letter')
    if not re.search(r"[0-9]", value):
      raise serializers.ValidationError('Password must contain at least one number')
    return value

  def create(self, validated_data):
    user = User.objects.create_user(**validated_data)
    return user
  
class PasswordResetSerializer(serializers.Serializer):
  email = serializers.EmailField(required=True)

  def validate_email(self, value):
    try:
      User.objects.get(email=value)
    except User.DoesNotExist:
      raise serializers.ValidationError('User with this email does not exist')
    return value
  
class SetNewPasswordSerializer(serializers.Serializer):
  password = serializers.CharField(write_only=True, required=True)
  password2 = serializers.CharField(write_only=True, required=True, label='Confirm Password')

  # uidb64 and token are not part of the request body, but passed via URL and context

  def validate(self, attrs):
    password = attrs.get('password')
    password2 = attrs.get('password2')
    uidb64 = self.context.get('uidb64')
    token = self.context.get('token')

    if not uidb64 or not token:
      raise serializers.ValidationError('UID and Token are required in context of validation')
    
    if password != password2:
      raise serializers.ValidationError('Passwords do not match')
    
    #password need to have at least 1 uppercase 1 lowercase and a number for 8 characters
    if len(password) < 8:
      raise serializers.ValidationError('Password must be at least 8 characters long')
    if not re.search(r"[a-z]", password):
      raise serializers.ValidationError('Password must contain at least one lowercase letter')
    if not re.search(r"[A-Z]", password):
      raise serializers.ValidationError('Password must contain at least one uppercase letter')
    if not re.search(r"[0-9]", password):
      raise serializers.ValidationError('Password must contain at least one number')
    
    try:
      uid = force_str(urlsafe_base64_decode(uidb64))
      self.user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
      raise serializers.ValidationError({'token':'Invalid token or user ID:'})
    
    if not default_token_generator.check_token(self.user, token):
      raise serializers.ValidationError({'token': 'Invalid token or user ID'})
    
    attrs['user'] = self.user
    return attrs

    



