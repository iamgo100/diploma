from django.shortcuts import render, redirect
from .forms import SignUpForm
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
    return render(request, 'profile.html')

def client(request):
    if request.user.profile.role == 'C':
        return render(request, 'client.html')
    return render(request, 'profile.html')

def admin(request):
    if request.user.profile.role == 'A':
        shifts_calendar = json.dumps([{
                'year': str(s.date).split('-')[0],
                'month': str(s.date).split('-')[1], 
                'day': str(s.date).split('-')[2], 
                'master': s.master.user.get_full_name(),
                'status': s.status
                } for s in Shift.objects.all()])
        return render(request, 'admin.html', {"shifts_calendar": shifts_calendar})
    return render(request, 'profile.html')

def employee(request):
    if request.user.profile.role == 'E':
        return render(request, 'employee.html')
    return render(request, 'profile.html')

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            user.refresh_from_db()
            user.profile.phone_number = form.cleaned_data.get('phone_number')
            user.first_name = form.cleaned_data.get('first_name')
            user.last_name = form.cleaned_data.get('last_name')
            user.save()
            return redirect('login')
    else:
        form = SignUpForm()
    return render(request, 'registration/signup.html', {'form': form})