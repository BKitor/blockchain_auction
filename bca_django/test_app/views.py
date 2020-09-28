from django.shortcuts import render
from django.http import HttpResponse

from rest_framework.decorators import api_view

# Create your views here.


@api_view(['GET'])
def public(request):
    return HttpResponse("You pressed the public Button")


@api_view(['GET'])
def private(request):
    return HttpResponse("You pressed the private Button")
