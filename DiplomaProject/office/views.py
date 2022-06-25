from django.shortcuts import render, redirect
from django.utils import timezone
from .models import Appointment, Service
from .forms import MakeAppointment

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
        ap_list = Appointment.objects.filter(client=request.user.profile, date__gte=timezone.now()).order_by('date', 'time')
        if request.method == 'POST':
            form = MakeAppointment(request.POST)
            if form.is_valid():
                appointment = form.save()
                appointment.client = request.user.profile
                appointment.save()
                return redirect('office')
        else:
            form = MakeAppointment()
        return render(request, 'client.html', {'form': form, 'ap_list': ap_list})
    return redirect('office')

def admin(request):
    if request.user.is_authenticated and request.user.profile.role == 'A':
        return render(request, 'admin.html')
    return redirect('office')

def employee(request):
    if request.user.is_authenticated and request.user.profile.role == 'E':
        return render(request, 'employee.html')
    return redirect('office')

def services(request):
    if request.user.is_authenticated and request.user.profile.role == 'A':
        return render(request, 'services.html')
    return redirect('office')