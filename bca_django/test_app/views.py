import json
import datetime
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse

from rest_framework.decorators import api_view
from test_app.models import Profile, User, SealedBid
from django.contrib.auth.models import Group
from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from test_app.serializer import UserSerializer, GroupSerializer, ProfileSerializer, SealedBidSerializer
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
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]


class ProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    # @action(detail=True, methods=['post'])
    # def set_password(self, request, pk=None):
    #   user = self.get_object()
    #  serializer = ProfileSerializer(data=request.data)
    # if serializer.is_valid():
    #    user.set_password(serializer.data['password'])
    #   user.save()
    #  return Response({'status': 'password set'})
    # else:
    #   return Response(serializer.errors,
    #                  status=status.HTTP_400_BAD_REQUEST)


class SealedBidViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = SealedBid.objects.all()
    serializer_class = SealedBidSerializer
    permission_classes = [IsAuthenticated]


class StartAuctionView(generics.RetrieveAPIView):
    queryset = SealedBid.objects.all()
    serializer_class = SealedBidSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, **kwargs):
        auction = self.get_object()

        if auction.auction_id != "":
            return Response({"error": "auction_id is not None, Can't start an auction that's already started", "value": auction.auction_id}, status=status.HTTP_400_BAD_REQUEST)

        if auction.min_bid is None:
            return Response({"error": "min_bid is None, Can't start an auction that doesn't have a mininum bid"}, status=status.HTTP_400_BAD_REQUEST)

        if auction.end_time is None:
            return Response({"error": "end_time is None, Can't start an that'll never end"}, status=status.HTTP_400_BAD_REQUEST)


        now = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(seconds=5)
        if(auction.end_time < now):
            return Response({"error": "end time has passed, the auction has to start before it ends"}, status=status.HTTP_400_BAD_REQUEST)

        time_d = auction.end_time - now
        time_limit = int(time_d.total_seconds())
        min_bid = auction.min_bid

        try:
            owner = Profile.objects.get(user=auction.owner)
        except Profile.DoesNotExist:
            return Response({"error": "owner of contract does not exist, the auction needs an owner"}, status=status.HTTP_404_NOT_FOUND)

        contract_id = bchain.launch_sealed_bid(time_limit, owner.wallet, min_bid)

        auction.auction_id = contract_id
        auction.save()

        return Response(SealedBidSerializer(auction, context={'request': request}).data, status=status.HTTP_200_OK)
