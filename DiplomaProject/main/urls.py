from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='main'),
    path('accounts/signup/<str:role>/', views.signup, name='signup'),
    path('accounts/myprofile/', views.profile, name='profile'),
    path('accounts/myprofile/change/', views.profile_change, name='profile_change')
]