from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='office'),
    path('client/', views.client, name='client'),
    path('admin/', views.admin, name='admin'),
    path('employee/', views.employee, name='employee'),
    path('get/appointments/', views.get_appointments),
    path('get/shifts/all/', views.get_shifts_all),
    path('get/shifts/<str:status>/', views.get_shifts_for_employee),
    path('post/shifts/confirm/<int:id>', views.post_shifts_confirm),
    path('get/appointments/time/<int:year>-<int:month>-<int:day>/<int:service_id>/', views.get_time_for_appointment),
    path('get/service-<int:id>/cost/', views.get_service_cost),
]