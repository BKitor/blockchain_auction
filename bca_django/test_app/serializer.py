from django.contrib.auth.models import Group
from rest_framework import serializers
from test_app.models import Profile, User, SealedBid


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'first_name', 'last_name']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class ProfileSerializer(serializers.HyperlinkedModelSerializer):

    user_id = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    username = serializers.CharField(source='user.username')
    email = serializers.CharField(source='user.email')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')

    class Meta:
        model = Profile
        fields = ['url', 'user_id', 'username', 'email', 'first_name',
                  'last_name', 'wallet', 'birthday', 'publicProfile']

    def update(self, instance, validated_data):
        # First, update the User
        user_data = validated_data.pop('user', {})
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()
        # Then, update UserProfile
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        profile, _ = Profile.objects.get_or_create(user=user)
        profile.birthday = validated_data['birthday']
        profile.wallet = validated_data['wallet']
        profile.publicProfile = validated_data['publicProfile']
        profile.save()
        return profile


class SealedBidSerializer(serializers.HyperlinkedModelSerializer):

    owner = serializers.PrimaryKeyRelatedField(many=False, queryset = Profile.objects.all())
    wallet = serializers.CharField(source='owner.wallet', read_only= True)
    class Meta:
        model = SealedBid
        fields = ['url','owner', 'wallet', 'end_time', 
        'auction_id', 'min_bid', 'item_description']

    def update(self, instance, validated_data):
        # First, update the User
        user_data = validated_data.pop('user', {})
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()
        # Then, update UserProfile
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def create(self, validated_data):
      
        # user_data = validated_data.pop('owner')
        # user = User.objects.create(**user_data)
        #sealedBid, _ = SealedBid.(owner=owner_data)
        sealed_bid = SealedBid()
        sealed_bid.owner = validated_data['owner']
        #sealedBid.wallet = validated_data['wallet']
        sealed_bid.end_time = validated_data['end_time']
        sealed_bid.auction_id = validated_data['auction_id']
        sealed_bid.min_bid = validated_data['min_bid']
        sealed_bid.item_description = validated_data['item_description']
        sealed_bid.save()
        return sealed_bid