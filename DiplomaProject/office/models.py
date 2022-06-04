from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from main.models import Profile

def get_deleted_user():
    return get_user_model().objects.get_or_create(username='deleted', first_name='Удален')[0]

class Shift(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField(
        verbose_name='Дата',
        default=timezone.now
    )
    status = models.CharField(
        verbose_name='Статус смены',
        max_length=1,
        choices=[
            ('N', 'Не подтверждено'),
            ('S', 'Подтверждено')
        ],
        default='N'
    )
    room = models.CharField(
        verbose_name='Зал смены',
        max_length=1,
        choices=[
            ('1', 'Парикмахерский'),
            ('2', 'Маникюрный')
        ],
        default='1'
    )
    master = models.ForeignKey(
        Profile,
        on_delete=models.SET(get_deleted_user),
        limit_choices_to={'role': 'E'},
        verbose_name='Мастер смены'
    )

    class Meta:
        verbose_name = 'Смена'
        verbose_name_plural = 'Смены'

    def __str__(self):
        return f'Смена {self.id}'
    
    def get_room(self, room):
        if room == '1':
            return 'Парикмахерский'
        elif room == '2':
            return 'Маникюрный'

class Service(models.Model):
    id = models.AutoField(primary_key=True)
    service_name = models.CharField(
        'Название услуги',
        max_length=100,
        unique=True,
        help_text='Название должно быть уникальным.'
    )
    cost = models.DecimalField(
        verbose_name='Цена',
        max_digits=7,
        decimal_places=2
    )
    duration = models.IntegerField(
        'Длительность услуги',
        help_text='Введите длительность услуги в минутах.',
    )
    room = models.CharField(
        verbose_name='Зал',
        max_length=1,
        choices=[
            ('1', 'Парикмахерский'),
            ('2', 'Маникюрный')
        ]
    )

    class Meta:
        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'

    def __str__(self):
        return self.service_name

class Appointment(models.Model):
    id = models.AutoField(primary_key=True)
    service = models.ForeignKey(
        Service,
        on_delete=models.SET_NULL,
        verbose_name='Услуга',
        null=True
    )
    date = models.DateField('Дата', help_text='Введите дату в формате: 01.01.2001')
    time = models.TimeField('Время')
    shift = models.ForeignKey(
        Shift,
        on_delete=models.SET_NULL,
        verbose_name='Смена',
        null=True,
        blank=True
    )
    client = models.ForeignKey(
        Profile,
        on_delete=models.SET(get_deleted_user),
        limit_choices_to={'role': 'C'},
        verbose_name='Клиент',
        null=True
    )

    class Meta:
        verbose_name = 'Запись'
        verbose_name_plural = 'Записи'

    def __str__(self):
        return f'Запись {self.id}'