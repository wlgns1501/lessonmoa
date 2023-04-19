from django.urls import path
from account.api.views import *


urlpatterns = [
    # path('user/', UserView.as_view(), name = 'users'),
    path('', UserDetailView.as_view(), name='user'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('signin/', SignInView.as_view(), name='signin'),
    path('logout/', LogOutView.as_view(), name='logout'),
]
