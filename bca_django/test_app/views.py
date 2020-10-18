from django.shortcuts import render
from django.http import HttpResponse

from rest_framework.decorators import api_view
from test_app.models import Profile, User
from django.contrib.auth.models import Group
from rest_framework import viewsets
from rest_framework import permissions
from test_app.serializer import UserSerializer, GroupSerializer, ProfileSerializer
from rest_framework.decorators import action
# Create your views here.


@api_view(['GET'])
def public(request):
    return HttpResponse("You pressed the public Button")


@api_view(['GET'])
def private(request):
    return HttpResponse("You pressed the private Button")


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
