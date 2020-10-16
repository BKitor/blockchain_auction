from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Profile(models.Model) :
    user = models.ForeignKey('auth.User', on_delete = models.CASCADE)
    wallet = models.CharField(max_length = 30)
    birthday = models.DateField()
    publicProfile = models.BooleanField()

