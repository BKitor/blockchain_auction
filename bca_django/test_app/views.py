import json
from django.shortcuts import render
from django.http import HttpResponse

from rest_framework.decorators import api_view
from test_app.models import Profile, User, SealedBid
from django.contrib.auth.models import Group
from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from test_app.serializer import UserSerializer, GroupSerializer, ProfileSerializer, SealedBidSerializer
from rest_framework.decorators import action
from test_app.blockchain import sealed_bid_bytecode, sealed_bid_abi, w3
from django.conf import settings
# Create your views here.


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

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
    permission_classes = [permissions.IsAuthenticated]


class StartAuctionView(generics.GenericAPIView):
    queryset = SealedBid.objects.all()
    serializer_class = SealedBidSerializer
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, **kwargs):
        auction = self.get_object()

        if auction.auction_id != "":
            return Response({"error": "auction_id is not None, Can't start an auction that's already started","value":auction.auction_id}, status=status.HTTP_400_BAD_REQUEST)

        if auction.min_bid is None:
            return Response({"error": "min_bid is None, Can't start an auction that doesn't have a mininum bid"}, status=status.HTTP_400_BAD_REQUEST)

        if auction.end_time is None:
            return Response({"error": "end_time is None, Can't start an that'll never end"}, status=status.HTTP_400_BAD_REQUEST)

        SealedBid = w3.eth.contract(
            abi=sealed_bid_abi, bytecode=sealed_bid_bytecode)

        time_limit = auction.end_time - time.now()
        min_bid = auction.min_bid

        tx_hash = SealedBid.constructor(
            time_limit, auction.owner, min_bid).transact({'from': settings.ADMIN_BLOCKCHAIN_USER})

        tx_receipt = w3.eth.waitForTransactionReceipt(tx_hash)

        auction.auction_id = tx_receipt.contractAddress
        auction.save()

        return Response(SealedBidSerializer(auction, context={'request': request}).data, status=status.HTTP_200_OK)
