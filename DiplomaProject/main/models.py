from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import User

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
    phone_regex = RegexValidator(
        regex = r'^\+?7?\d{10}$',
        message = "Номер телефона необходимо вводить в формате: '+79991234567'."
    )
    phone_number = models.CharField(
        verbose_name='Телефон',
        max_length=12,
        validators=[phone_regex],
        blank=True
    )

    def __str__(self):
        return self.user.get_full_name()