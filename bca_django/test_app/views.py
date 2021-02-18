import json
import datetime
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse

from rest_framework.decorators import api_view, permission_classes
from test_app.models import Profile, User, SealedBid, English, Dutch, Channel
from django.contrib.auth.models import Group
from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from test_app.serializer import UserSerializer, GroupSerializer, ProfileSerializer, SealedBidSerializer, EnglishSerializer, DutchSerializer, ChannelSerializer
from rest_framework.decorators import action
from test_app.blockchain import BChain

# Create your views here.
bchain = BChain()
w3 = bchain.get_w3()


class IsAuthenticated(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        if request.method == 'OPTIONS':
            return True
        return super(IsAuthenticated, self).has_permission(request, view)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]


class ProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Profiles to be viewed or edited.
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]


class SealedBidViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows SlealedBidAuctions to be viewed or edited.
    """
    queryset = SealedBid.objects.all()
    serializer_class = SealedBidSerializer
    permission_classes = [IsAuthenticated]

    @action(methods=['PUT'], detail=True, url_path='start')
    def start_auction(self, request, **kwargs):
        auction = self.get_object()

        if auction.auction_id != "":
            return Response({"error": "auction_id is not None, Can't start an auction that's already started", "value": auction.auction_id}, status=status.HTTP_400_BAD_REQUEST)

        if auction.min_bid is None:
            return Response({"error": "min_bid is None, Can't start an auction that doesn't have a mininum bid"}, status=status.HTTP_400_BAD_REQUEST)

        if auction.end_time is None:
            return Response({"error": "end_time is None, Can't start an that'll never end"}, status=status.HTTP_400_BAD_REQUEST)

        now = datetime.datetime.now(
            datetime.timezone.utc) + datetime.timedelta(seconds=5)
        if(auction.end_time < now):
            return Response({"error": "end time has passed, the auction has to start before it ends"}, status=status.HTTP_400_BAD_REQUEST)

        time_d = auction.end_time - now

        time_limit = int(time_d.total_seconds() / 60)

        min_bid = auction.min_bid

        try:
            owner = Profile.objects.get(user=auction.owner)
        except Profile.DoesNotExist:
            return Response({"error": "owner of contract does not exist, the auction needs an owner"}, status=status.HTTP_404_NOT_FOUND)

        contract_id = bchain.launch_sealed_bid(
            time_limit, owner.wallet, min_bid)

        auction.auction_id = contract_id
        auction.save()

        return Response(SealedBidSerializer(auction, context={'request': request}).data, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_new_user(request):
    # this is an endpoint without authentication for creating a new user
    # this would probably need stuff like rate limiting and protection against DOSs or somethig
    p = ProfileSerializer(data=request.data, context={'request': request})
    p.is_valid(raise_exception=True)

    if len(User.objects.filter(username=request.data['username'])) > 0:
        return Response({"message": "Username is taken"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        p.save()
        return Response(p.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile_by_uname(request, username=None):
    u = get_object_or_404(User, username=username)
    p = get_object_or_404(Profile, user=u)
    return Response(ProfileSerializer(p, context={'request': request}).data, status=status.HTTP_200_OK)


class EnglishViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows English Auctions to be viewed or edited.
    """
    queryset = English.objects.all()
    serializer_class = EnglishSerializer
    permission_classes = [IsAuthenticated]

    @action(methods=['PUT'], detail=True, url_path='start')
    def start_auction(self, request, **kwargs):
        auction = self.get_object()

        if auction.auction_id != "":
            return Response({"error": "auction_id is not None, Can't start an auction that's already started", "value": auction.auction_id}, status=status.HTTP_400_BAD_REQUEST)

        if auction.min_bid is None:
            return Response({"error": "min_bid is None, Can't start an auction that doesn't have a mininum bid"}, status=status.HTTP_400_BAD_REQUEST)

        if auction.end_time is None:
            return Response({"error": "end_time is None, Can't start an that'll never end"}, status=status.HTTP_400_BAD_REQUEST)

        now = datetime.datetime.now(
            datetime.timezone.utc) + datetime.timedelta(seconds=5)
        if(auction.end_time < now):
            return Response({"error": "end time has passed, the auction has to start before it ends"}, status=status.HTTP_400_BAD_REQUEST)

        time_d = auction.end_time - now
        time_limit = int(time_d.total_seconds() / 60)
        min_bid = auction.min_bid

        try:
            owner = Profile.objects.get(user=auction.owner)
        except Profile.DoesNotExist:
            return Response({"error": "owner of contract does not exist, the auction needs an owner"}, status=status.HTTP_404_NOT_FOUND)

        contract_id = bchain.launch_english(
            time_limit, owner.wallet, min_bid)

        auction.auction_id = contract_id
        auction.save()

        return Response(EnglishSerializer(auction, context={'request': request}).data, status=status.HTTP_200_OK)


class DutchViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Dutch Auctions to be viewed or edited.
    """
    queryset = Dutch.objects.all()
    serializer_class = DutchSerializer
    permission_classes = [IsAuthenticated]

    @action(methods=['PUT'], detail=True, url_path='start')
    def start_auction(self, request, **kwargs):
        auction = self.get_object()

        if auction.auction_id != "":
            return Response({"error": "auction_id is not None, Can't start an auction that's already started", "value": auction.auction_id}, status=status.HTTP_400_BAD_REQUEST)

        if auction.min_bid is None:
            return Response({"error": "min_bid is None, Can't start an auction that doesn't have a mininum bid"}, status=status.HTTP_400_BAD_REQUEST)

        if auction.start_price is None:
            return Response({"error": "start_price is None, Can't start an that without an initial price"}, status=status.HTTP_400_BAD_REQUEST)

        if auction.rate is None:
            return Response({"error": "rate is None, Can't start an that'll never end"}, status=status.HTTP_400_BAD_REQUEST)

        if auction.end_time is None:
            return Response({"error": "end_time is None, Can't start an that'll never end"}, status=status.HTTP_400_BAD_REQUEST)

        now = datetime.datetime.now(
            datetime.timezone.utc) + datetime.timedelta(seconds=5)
        if(auction.end_time < now):
            return Response({"error": "end time has passed, the auction has to start before it ends"}, status=status.HTTP_400_BAD_REQUEST)

        time_d = auction.end_time - now
        # time_limit = int(time_d.total_seconds())
        time_limit = int(time_d.total_seconds() / 60)
        min_bid = auction.min_bid

        try:
            owner = Profile.objects.get(user=auction.owner)
        except Profile.DoesNotExist:
            return Response({"error": "owner of contract does not exist, the auction needs an owner"}, status=status.HTTP_404_NOT_FOUND)

        contract_id = bchain.launch_dutch(
            time_limit, owner.wallet, min_bid, auction.start_price, auction.rate)

        auction.auction_id = contract_id
        auction.save()

        return Response(DutchSerializer(auction, context={'request': request}).data, status=status.HTTP_200_OK)


class ChannelViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Channel Auctions to be viewed or edited.
    """
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer
    permission_classes = [IsAuthenticated]

    @action(methods=['PUT'], detail=True, url_path='start')
    def start_auction(self, request, **kwargs):
        auction = self.get_object()

        if auction.auction_id != "":
            return Response({"error": "auction_id is not None, Can't start an auction that's already started", "value": auction.auction_id}, status=status.HTTP_400_BAD_REQUEST)

        if auction.min_bid is None:
            return Response({"error": "min_bid is None, Can't start an auction that doesn't have a mininum bid"}, status=status.HTTP_400_BAD_REQUEST)

        if auction.buy_now_price is None:
            return Response({"error": "buy_now_price is None, Can't start an that without an initial price"}, status=status.HTTP_400_BAD_REQUEST)

        if auction.end_time is None:
            return Response({"error": "end_time is None, Can't start an that'll never end"}, status=status.HTTP_400_BAD_REQUEST)

        now = datetime.datetime.now(
            datetime.timezone.utc) + datetime.timedelta(seconds=5)
        if(auction.end_time < now):
            return Response({"error": "end time has passed, the auction has to start before it ends"}, status=status.HTTP_400_BAD_REQUEST)

        time_d = auction.end_time - now
        # time_limit = int(time_d.total_seconds())
        time_limit = int(time_d.total_seconds() / 60)
        min_bid = auction.min_bid

        try:
            owner = Profile.objects.get(user=auction.owner)
        except Profile.DoesNotExist:
            return Response({"error": "owner of contract does not exist, the auction needs an owner"}, status=status.HTTP_404_NOT_FOUND)

        contract_id = bchain.launch_channel(
            time_limit, owner.wallet, min_bid, auction.buy_now_price)

        auction.auction_id = contract_id
        auction.save()

        return Response(ChannelSerializer(auction, context={'request': request}).data, status=status.HTTP_200_OK)
