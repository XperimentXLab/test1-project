from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
  ic = models.CharField(max_length=12, unique=True)
  email = models.EmailField(unique=True)
  is_active = models.BooleanField(default=True)

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = 'username', 'ic'

  def __str__(self):
    return self.username