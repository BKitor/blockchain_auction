from test_app import views
from django.urls import include, path
from rest_framework import routers


router = routers.DefaultRouter()
# router.register(r'users', views.UserViewSet)
# router.register(r'groups', views.GroupViewSet)
router.register(r'profile', views.ProfileViewSet)
router.register(r'auction', views.SealedBidViewSet)
# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('auction/<pk>/start_auction', views.StartAuctionView.as_view()),
    path('profile/uname/<username>/', views.get_profile_by_uname),
]
