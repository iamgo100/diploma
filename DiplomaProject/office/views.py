from django.shortcuts import render, redirect
from .models import Shift
import json

def index(request):
    if request.user.is_authenticated:
        if request.user.profile.role == 'A':
            return redirect('admin')
        elif request.user.profile.role == 'E':
            return redirect('employee')
        elif request.user.profile.role == 'C':
            return redirect('client')
    return redirect('main')

def client(request):
    if request.user.is_authenticated and request.user.profile.role == 'C':
        return render(request, 'client.html')
    return redirect('office')

def admin(request):
    if request.user.is_authenticated and request.user.profile.role == 'A':
        shifts_calendar = json.dumps([{
            'id': s.id,
            'year': str(s.date).split('-')[0],
            'month': str(s.date).split('-')[1], 
            'day': str(s.date).split('-')[2], 
            'master': s.master.user.get_full_name(),
            'status': s.status,
            'room': s.get_room(s.room)
            } for s in Shift.objects.all()])
        return render(request, 'admin.html', {"shifts_calendar": shifts_calendar})
    return redirect('office')

def employee(request):
    if request.user.is_authenticated and request.user.profile.role == 'E':
        return render(request, 'employee.html')
    return redirect('office')

def profile(request):
    if request.user.is_authenticated and request.user.is_authenticated:
        return render(request, 'profile.html')
    return redirect('main')