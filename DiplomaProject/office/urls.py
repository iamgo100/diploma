from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='office'),
    path('client/', views.client, name='client'),
    path('admin/', views.admin, name='admin'),
    path('employee/', views.employee, name='employee'),
    path('get/appointments/', views.get_appointments),
    path('get/shifts/all/', views.get_shifts_all),
    path('get/shifts/unconfirmed/', views.get_shifts_unconfirmed),
    path('get/shifts/confirmed/', views.get_shifts_confirmed),
    path('post/shifts/confirm/<int:id>', views.post_shifts_confirm)
]