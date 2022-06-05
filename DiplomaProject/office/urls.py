from django.urls import path
from . import views, controller

urlpatterns = [
    path('', views.index, name='office'),
    path('client/', views.client, name='client'),
    path('admin/', views.admin, name='admin'),
    path('employee/', views.employee, name='employee'),
    path('get/appointments/', controller.get_appointments),
    path('get/appointments/<int:id>', controller.get_appointment_by_id),
    path('get/shifts/<int:id>', controller.get_shift_by_id),
    path('get/shifts/all/', controller.get_shifts_all),
    path('get/shifts/<str:status>/', controller.get_shifts_for_employee),
    path('post/shifts/confirm/<int:id>', controller.post_shifts_confirm),
    path('post/shifts/new/', controller.post_shifts_new),
    path('post/shifts/update/<int:id>', controller.post_shifts_update),
    path('post/shifts/delete/<int:id>', controller.post_shifts_delete),
    path('get/appointments/time/<int:year>-<int:month>-<int:day>/<int:service_id>/', controller.get_time_for_appointment),
    path('get/service-<int:id>/cost/', controller.get_service_cost),
]