from django.shortcuts import render
from django.http import HttpResponse

from rest_framework.decorators import api_view
from test_app.models import Profile, User, SealedBid
from django.contrib.auth.models import Group
from rest_framework import viewsets
from rest_framework import permissions
from test_app.serializer import UserSerializer, GroupSerializer, ProfileSerializer, SealedBidSerializer
from rest_framework.decorators import action
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
