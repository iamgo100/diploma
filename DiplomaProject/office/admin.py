from django.contrib import admin
from .models import Shift

class ShiftAdmin(admin.ModelAdmin):
    fields = ['date', 'master', 'room']
    list_display = ('date', 'master', 'status')

admin.site.register(Shift, ShiftAdmin)