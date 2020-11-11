from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.utils import timezone
# Create your models here.


class User(AbstractUser):
    pass


class Profile(models.Model):
    user = models.OneToOneField(
        User, primary_key=True, related_name='profile', on_delete=models.CASCADE)
    wallet = models.CharField(max_length=30)
    birthday = models.DateField(default=timezone.now)
    publicProfile = models.BooleanField(default=False)

    @receiver(post_save, sender=User)
    def create_profile_for_user(sender, instance=None, created=False, **kwargs):
        if created:
            Profile.objects.get_or_create(user=instance)

    @receiver(pre_delete, sender=User)
    def delete_profile_for_user(sender, instance=None, **kwargs):
        if instance:
            profile = Profile.objects.get(user=instance)
            profile.delete()


class SealedBid(models.Model):
    
    owner = models.ForeignKey(
        Profile, on_delete=models.SET_NULL, null=True, default=1)

    end_time = models.DateTimeField(null=True, blank=True)

    min_bid = models.IntegerField()
    auction_id = models.CharField(max_length=30, blank=True)
    item_description = models.CharField(max_length=400)

    # AUCTION_TYPE = (
    #   ('D', 'Dutch'),
    #  ('E', 'English'),
    # ('S', 'SealedBid'),
    # ('C', 'Channel'),
    # )
    # auction_type = models.CharField(max_length=1, choices=AUCTION_TYPE)
