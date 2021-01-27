from test_app import views
from django.urls import include, path
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'profile', views.ProfileViewSet)
router.register(r'auction/sealed_bid', views.SealedBidViewSet)
router.register(r'auction/english_auction', views.EnglishViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('profile/uname/<username>/', views.get_profile_by_uname),
    path('newuser/', views.create_new_user),
]
