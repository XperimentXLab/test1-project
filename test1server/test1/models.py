from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
  ic = models.CharField(max_length=12, unique=True)
  username = models.CharField(max_length=255,unique=True)
  email = models.EmailField(unique=True)
  wallet_address = models.CharField(max_length=255, unique=True, blank=True, null=True)
  is_active = models.BooleanField(default=True)

  def __str__(self):
    return self.username