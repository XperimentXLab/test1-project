from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.crypto import get_random_string
import string

class User(AbstractUser):
  ic = models.CharField(max_length=12, unique=True)
  username = models.CharField(max_length=255,unique=True)
  email = models.EmailField(unique=True)
  wallet_address = models.CharField(max_length=255, unique=True, blank=True, null=True)
  #referral_code = models.CharField(max_length=7,unique=True, blank=True)
  is_active = models.BooleanField(default=True)

  def referral_code_generator(self):
    while True:
      code = get_random_string(length=7, allowed_chars=string.ascii_uppercase + string.digits)
      if not self.__class__.objects.filter(referral_code=code).exists():
        return code

  def __str__(self):
    return self.username
  
  #def save(self, *args, **kwargs):
  #  if not self.referral_code:
  #    self.referral_code = self.referral_code_generator()
  #    super().save(*args, **kwargs)