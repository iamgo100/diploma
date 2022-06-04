from django.contrib import admin
from .models import Shift, Service, Appointment

class ShiftAdmin(admin.ModelAdmin):
    fields = ['date', 'master', 'room']
    list_display = ('date', 'master', 'status')

class ServicetAdmin(admin.ModelAdmin):
    list_display = ('service_name', 'cost', 'duration', 'room')

class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('service', 'client', 'date', 'time', 'shift')

admin.site.register(Shift, ShiftAdmin)
admin.site.register(Service, ServicetAdmin)
admin.site.register(Appointment, AppointmentAdmin)