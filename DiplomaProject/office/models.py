from django.db import models
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from main.models import Profile

def get_deleted_user():
    return get_user_model().objects.get_or_create(username='deleted')[0]

class Shift(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField(
        verbose_name='Дата',
        default=now
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
        return 'Смена ' + str(self.id)
    
    def get_room(self, room):
        if room == '1':
            return 'Парикмахерский'
        elif room == '2':
            return 'Маникюрный'