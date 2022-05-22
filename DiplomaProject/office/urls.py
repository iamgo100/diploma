from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='office'),
    path('client/', views.client, name='client'),
    path('admin/', views.admin, name='admin'),
    path('employee/', views.employee, name='employee'),
    path('myprofile/', views.profile, name='profile')
]