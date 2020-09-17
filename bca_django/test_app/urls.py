from django.conf.urls import url
from test_app import views

urlpatterns = [
       url(r'^api/public/', views.public),
       url(r'^api/private/', views.private),
]
