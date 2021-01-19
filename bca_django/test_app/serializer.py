from django.contrib.auth.models import Group
from rest_framework import serializers
from test_app.models import Profile, User, SealedBid, English


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
    email = serializers.CharField(source='user.email', required=False)
    first_name = serializers.CharField(
        source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    password = serializers.CharField(source='user.password', write_only=True)

    class Meta:
        model = Profile
        fields = ['url', 'user_id', 'username', 'email', 'first_name',
                  'last_name', 'wallet', 'birthday', 'publicProfile', 'password']

    def update(self, instance, validated_data):
        # First, update the User
        user_data = validated_data.pop('user', {})
        for attr, value in user_data.items():
            if attr == 'password':
                continue
            setattr(instance.user, attr, value)
        instance.user.save()
        # Then, update UserProfile
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        profile, _ = Profile.objects.get_or_create(user=user)
        profile.birthday = validated_data['birthday'] if 'birthday' in validated_data.keys(
        ) else '2000-1-1'
        profile.wallet = validated_data['wallet']
        profile.publicProfile = validated_data['publicProfile'] if 'publicProfile' in validated_data else False
        profile.save()
        return profile


class SealedBidSerializer(serializers.HyperlinkedModelSerializer):

    owner = serializers.PrimaryKeyRelatedField(
        many=False, queryset=Profile.objects.all())
    auction_id = serializers.CharField(allow_blank=True)
    end_time = serializers.DateTimeField(allow_null=True)

    class Meta:
        model = SealedBid
        fields = ['url', 'id', 'owner', 'end_time',
                  'auction_id', 'min_bid', 'item_description']

    def create(self, validated_data):
        sealed_bid = SealedBid()
        sealed_bid.owner = validated_data['owner']
        sealed_bid.end_time = validated_data.get('end_time')
        sealed_bid.auction_id = validated_data.get('auction_id')
        sealed_bid.min_bid = validated_data['min_bid']
        sealed_bid.item_description = validated_data['item_description']
        sealed_bid.save()
        return sealed_bid


class EnglishSerializer(serializers.HyperlinkedModelSerializer):

    owner = serializers.PrimaryKeyRelatedField(
        many=False, queryset=Profile.objects.all())
    auction_id = serializers.CharField(allow_blank=True)
    end_time = serializers.DateTimeField(allow_null=True)

    class Meta:
        model = English
        fields = ['url', 'id', 'owner', 'end_time',
                  'auction_id', 'min_bid', 'current_bid', 'item_description']

    def create(self, validated_data):
        english_auction = English()
        english_auction.owner = validated_data['owner']
        english_auction.end_time = validated_data.get('end_time')
        english_auction.auction_id = validated_data.get('auction_id')
        english_auction.min_bid = validated_data['min_bid']
        english_auction.current_bid = validated_data['current_bid']
        english_auction.item_description = validated_data['item_description']
        english_auction.save()
        return english_auction
