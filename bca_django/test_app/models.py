from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.utils import timezone
from django.conf import settings
from rest_framework.authtoken.models import Token
# Create your models here.


class User(AbstractUser):
    pass


class Profile(models.Model):
    user = models.OneToOneField(
        User, primary_key=True, related_name='profile', on_delete=models.CASCADE)
    wallet = models.CharField(max_length=50)
    birthday = models.DateField(default=timezone.now)
    publicProfile = models.BooleanField(default=False)


class Auction(models.Model):
    item_description = models.CharField(max_length=400)
    owner = models.ForeignKey(
        Profile, on_delete=models.SET_NULL, null=True, default=1)
    end_time = models.DateTimeField(null=True, blank=True)
    auction_id = models.CharField(max_length=30, blank=True)

    class Meta:
        abstract = True


class SealedBid(Auction):

    min_bid = models.IntegerField()


@receiver(post_save, sender=User)
def create_profile_for_user(sender, instance=None, created=False, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)


@receiver(pre_delete, sender=User)
def delete_profile_for_user(sender, instance=None, **kwargs):
    if instance:
        profile = Profile.objects.get(user=instance)
        profile.delete()


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


@receiver(pre_delete, sender=settings.AUTH_USER_MODEL)
def delete_auth_token(sender, instance=None, using=None, **kwargs):
    if instance:
        token = Token.objects.get(user=instance)
        token.delete()

class English(Auction):
    min_bid = models.IntegerField()


class Dutch(Auction):
    min_bid = models.IntegerField()