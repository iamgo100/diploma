from cProfile import label
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.validators import RegexValidator

class SignUpForm(UserCreationForm):
    phone_regex = RegexValidator(regex = r'^\+?7?\d{9,10}$', message='Ошибка. Введите телефон в нужном формате')

    first_name = forms.CharField(label='Ваше имя', help_text='Обязательное поле', required=True)
    last_name = forms.CharField(label='Ваша фамилия', required=False)
    phone_number = forms.CharField(
        label='Телефон',
        help_text="Обязательное поле. Номер телефона необходимо вводить в формате: '+79991234567'.",
        required=True,
        max_length=12,
        validators=[phone_regex])

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'phone_number', 'password1', 'password2', )