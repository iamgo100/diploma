from django.http import HttpResponse
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
        return render(request, 'admin.html')
    return redirect('office')

def employee(request):
    if request.user.is_authenticated and request.user.profile.role == 'E':
        return render(request, 'employee.html')
    return redirect('office')

def get_appointments(request):
    this_user = request.user
    if this_user.is_authenticated:
        appointment_list = Appointment.objects.all()
        if this_user.profile.role == 'E':
            appointment_list = appointment_list.filter(shift__in=Shift.objects.filter(master=this_user.profile, status='S'))
        appointments = json.dumps([{
            'id': a.id, 
            'client': a.client.user.first_name,
            'date': str(a.date).split('-'),
            'time': str(a.time).split(':'),
            'service': str(a.service),
            'shift': str(a.shift)
            } for a in appointment_list])
        return HttpResponse(appointments)
    return HttpResponse('Error')

def get_shifts_all(request):
    if request.user.is_authenticated and request.user.profile.role == 'A':
        shifts_calendar = json.dumps([{
            'id': s.id,
            'date': str(s.date).split('-'),
            'master': s.master.user.get_full_name(),
            'status': s.status,
            'room': s.get_room(s.room)
            } for s in Shift.objects.all()])
        return HttpResponse(shifts_calendar)
    return HttpResponse('Error')

def get_shifts_unconfirmed(request):
    this_user = request.user
    if this_user.is_authenticated and this_user.profile.role == 'E':
        unconfirmed_shifts = json.dumps([{
            'id': s.id,
            'date': str(s.date),
            'room': s.get_room(s.room)
            } for s in Shift.objects.filter(master=this_user.profile, status='N')])
        return HttpResponse(unconfirmed_shifts)
    return HttpResponse('Error')

def get_shifts_confirmed(request):
    this_user = request.user
    if this_user.is_authenticated and this_user.profile.role == 'E':
        shifts_calendar = json.dumps([{
            'id': s.id,
            'date': str(s.date).split('-'),
            'status': s.status,
            'room': s.get_room(s.room)
            } for s in Shift.objects.filter(master=this_user.profile, status='S')])
        return HttpResponse(shifts_calendar)
    return HttpResponse('Error')

def post_shifts_confirm(request, id):
    this_user = request.user
    if this_user.is_authenticated and this_user.profile.role == 'E' and request.method == 'POST':
        shift = Shift.objects.get(pk=id)
        shift.status = 'S'
        shift.save()
        return HttpResponse('Success')
    return HttpResponse('Error')