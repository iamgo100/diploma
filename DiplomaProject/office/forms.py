import datetime
from .models import Appointment, Service
from django import forms

HOUR_CHOICES = [(datetime.time(hour=x), '{:02d}:00'.format(x)) for x in range(0, 2)]

class MakeAppointment(forms.ModelForm):
    service = forms.ModelChoiceField(queryset=Service.objects.all(), label='Выберите услугу')
    date = forms.DateField(label='Введите дату', help_text='Введите дату в формате: DD.MM.YYYY')
    time = forms.TimeField(widget=forms.Select(choices=HOUR_CHOICES), required=True)

    class Meta:
        model = Appointment
        fields = ['service', 'date', 'time']