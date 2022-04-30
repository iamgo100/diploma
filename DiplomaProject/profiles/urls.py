from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.index, name='profile'),
    path('profile/client', views.client, name='client'),
    path('profile/admin', views.admin, name='admin'),
    path('profile/employee', views.employee, name='employee'),
    path('signup/', views.signup, name='signup')
]