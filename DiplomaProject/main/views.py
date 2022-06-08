from django.http import HttpResponse
from django.db import IntegrityError
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from .forms import ProfileForm, SignUpClientForm, SignUpEmplForm, UpdateUserForm
from .models import Profile
import json, random, string, re

def get_or_create_user(first_name, phone, role='C'):
    regex = r'^\+?7?\d{10}$'
    if re.match(regex, phone):
        # проверяем наличие клиента с таким именем и номером телефона
        users = User.objects.filter(first_name=first_name)
        this_user = None
        for user in users:
            this_user = list(Profile.objects.filter(user=user, phone_number=phone))
            if this_user:
                break
        if not this_user: # если такого клиента не оказалось, создаем его
            letters = string.ascii_lowercase + ''.join(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'])
            rand_string = ''.join(random.sample(letters, 8))
            try:
                user = User.objects.create(username=phone, password=rand_string, first_name=first_name)
                this_user = Profile.objects.create(user=user, phone_number=phone, role=role)
            except IntegrityError:
                this_user = 'unique_error'
        if type(this_user) == list:
            this_user = this_user[0]
    else:
        this_user = 'phone_error'
    return this_user

def index(request):
    if request.user.is_authenticated:
        return redirect('office')
    return redirect('login')
    # return render(request, 'index.html')

def signup(request, role='C'):
    if request.method == 'POST':
        if role == 'C':
            user_form = SignUpClientForm(request.POST)
        else:
            user_form = SignUpEmplForm(request.POST)
        profile_form = ProfileForm(request.POST)
        if user_form.is_valid() and profile_form.is_valid():
            if role == 'C':
                user = user_form.save()
                user.save()
                user.refresh_from_db()
                phone = profile_form.cleaned_data.get('phone_number')
                Profile.objects.create(user=user, role=role, phone_number=phone)
            else:
                first_name = user_form.cleaned_data.get('first_name')
                phone = profile_form.cleaned_data.get('phone_number')
                res = get_or_create_user(first_name, phone, role=role)
                if res == 'unique_error':
                    return render(request, 'registration/signup.html', {'user_form': user_form, 'profile_form': profile_form, 'unique_error': True})
                elif res == 'phone_error':
                    return render(request, 'registration/signup.html', {'user_form': user_form, 'profile_form': profile_form, 'phone_error': True})
            if request.user.is_authenticated:
                return redirect('office')
            return redirect('login')
    else:
        if role == 'C':
            user_form = SignUpClientForm()
        else:
            user_form = SignUpEmplForm()
        profile_form = ProfileForm()
    return render(request, 'registration/signup.html', {'user_form': user_form, 'profile_form': profile_form})

def profile(request):
    if request.user.is_authenticated:
        return render(request, 'profile.html')
    return redirect('main')

def profile_change(request):
    if request.user.is_authenticated:
        if request.method == "POST":
            user_form = UpdateUserForm(request.POST, instance=request.user)
            profile_form = ProfileForm(request.POST, instance=request.user.profile)
            if user_form.is_valid() and profile_form.is_valid():
                user_form.save()
                profile_form.save()
                return redirect('profile')
        else:
            user_form = UpdateUserForm(instance=request.user)
            profile_form = ProfileForm(instance=request.user.profile)
        return render(request, 'profile_change.html', {'user_form': user_form, 'profile_form': profile_form})
    return redirect('main')

def get_masters(request):
    masters = json.dumps([{
        'master': str(master),
        'master_id': master.id
    } for master in Profile.objects.filter(role='E')])
    return HttpResponse(masters)