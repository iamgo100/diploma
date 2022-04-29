from django.db import models

from django.conf import settings

class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    role = models.CharField(
        max_length=1,
        choices=[('C', 'клиент'), ('E', 'сотрудник'), ('A', 'администратор')],
        default='C'
    )