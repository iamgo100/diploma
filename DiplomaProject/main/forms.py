from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Profile

class SignUpClientForm(UserCreationForm):
    first_name = forms.CharField(label='Ваше имя', help_text='Обязательное поле', required=True)
    last_name = forms.CharField(label='Ваша фамилия', required=False)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2')

class SignUpEmplForm(forms.ModelForm):
    first_name = forms.CharField(label='Имя', help_text='Обязательное поле', required=True)
    last_name = forms.CharField(label='Фамилия', required=False)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')

class ProfileForm(forms.ModelForm):
    phone_number = forms.CharField(
        label='Телефон',
        help_text="Обязательное поле. Номер телефона необходимо вводить в формате: '+79991234567'.",
        required=True,
        max_length=12)
    
    class Meta:
        model = Profile
        fields = ('phone_number',)

class UpdateUserForm(forms.ModelForm):
    first_name = forms.CharField(label='Ваше имя', help_text='Обязательное поле', required=True)
    last_name = forms.CharField(label='Ваша фамилия', required=False)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email')