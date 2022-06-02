from msilib.schema import Error
from django.shortcuts import render, redirect
from .models import Appointment, Shift
import json

def index(request):
    if request.user.is_authenticated:
        if request.user.profile.role == 'A':
            return redirect('admin')
        elif request.user.profile.role == 'E':
            return redirect('employee')
        elif request.user.profile.role == 'C':
            return redirect('client')
    return redirect('login')

def client(request):
    if request.user.is_authenticated and request.user.profile.role == 'C':
        return render(request, 'client.html')
    return redirect('office')

def admin(request):
    if request.user.is_authenticated and request.user.profile.role == 'A':
        shifts_calendar = json.dumps([{
            'id': s.id,
            'date': str(s.date).split('-'), 
            'master': s.master.user.get_full_name(),
            'status': s.status,
            'room': s.get_room(s.room)
            } for s in Shift.objects.all()])
        appointments_calendar = json.dumps([{
            'id': a.id, 
            'client': a.client.user.first_name,
            'date': str(a.date).split('-'),
            'time': str(a.time).split(':'),
            'service': str(a.service),
            'shift': str(a.shift)
            } for a in Appointment.objects.all()])
        return render(request, 'admin.html', {"shifts_calendar": shifts_calendar, "appointments_calendar": appointments_calendar})
    return redirect('office')

def employee(request):
    if request.user.is_authenticated and request.user.profile.role == 'E':
        return render(request, 'employee.html')
    return redirect('office')