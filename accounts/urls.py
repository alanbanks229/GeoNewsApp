
from django.urls import path
from django.contrib.auth.views import LogoutView

from . import views

urlpatterns = [
     path('signup', views.RegisterView.as_view(), name='signup'),
     path('login',  views.LoginView.as_view(), name = 'login'),
     path('logout', LogoutView.as_view(), name = 'logout'),
]
