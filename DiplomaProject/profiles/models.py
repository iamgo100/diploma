from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import User
# from django.db.models.signals import post_save
# from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.utils.timezone import now

class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )
    role = models.CharField(
        verbose_name='Роль',
        max_length=1,
        choices=[('C', 'клиент'), ('E', 'сотрудник'), ('A', 'администратор')],
        default='C'
    )
    phone_regex = RegexValidator(regex = r'^\+?7?\d{9,10}$', message = "Номер телефона необходимо вводить в формате: '+79991234567'.")
    phone_number = models.CharField(
        verbose_name='Телефон',
        max_length=12,
        validators=[phone_regex],
        blank=True
    )

    def __str__(self):
        return self.user.get_full_name()

# @receiver(post_save, sender=User)
# def update_user_profile(sender, instance, created, **kwargs):
#     if created:
#         Profile.objects.create(user=instance)
#     instance.profile.save()

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