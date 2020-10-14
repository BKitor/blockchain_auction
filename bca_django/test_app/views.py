from django.shortcuts import render
from django.http import HttpResponse

from rest_framework.decorators import api_view

from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import permissions
#from tutorial.quickstart.serializers import UserSerializer, GroupSerializer
from test_app.serializer import UserSerializer, GroupSerializer
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