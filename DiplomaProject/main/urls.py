from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='main'),
    path('accounts/signup/', views.signup, name='signup'),
    path('accounts/myprofile/', views.profile, name='profile')
]