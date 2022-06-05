from django.shortcuts import render, redirect
from .forms import ProfileForm, SignUpForm, UpdateUserForm
from .models import Profile

def index(request):
    if request.user.is_authenticated:
        return redirect('office')
    return redirect('login')
    # return render(request, 'index.html')

def signup(request, role='C'):
    if request.method == 'POST':
        user_form = SignUpForm(request.POST)
        profile_form = ProfileForm(request.POST)
        if user_form.is_valid() and profile_form.is_valid():
            user = user_form.save()
            user.first_name = user_form.cleaned_data.get('first_name')
            user.last_name = user_form.cleaned_data.get('last_name')
            user.save()
            user.refresh_from_db()
            phone = profile_form.cleaned_data.get('phone_number')
            profile = Profile.objects.create(user=user, phone_number=phone, role=role)
            profile.save()
            if request.user.is_authenticated:
                return redirect('office')
            return redirect('login')
    else:
        user_form = SignUpForm()
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