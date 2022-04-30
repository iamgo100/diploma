from dataclasses import fields
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import Profile, Shift

class UserInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name = 'Доп. информация'

class UserAdmin(UserAdmin):
    inlines = (UserInline, )

class ShiftAdmin(admin.ModelAdmin):
    fields = ['date', 'master']
    list_display = ('date', 'master', 'status')

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Shift, ShiftAdmin)