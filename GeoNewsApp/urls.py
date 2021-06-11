"""GeoNewsApp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
# . means from this directory
from . import views

urlpatterns = [
    # if the user inputs the website with no other 
    path('', views.homepage, name="homepage"),
    path('count_homepage/', views.count_homepage, name='count_homepage'),
                                          #name= allows us to refer to this in html template
    path('result_of_count/', views.count, name='count_result'),
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
]
