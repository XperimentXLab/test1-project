from rest_framework import serializers
from .models import User
import re 

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
      raise serializers.ValidationError('I/C already in use')
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