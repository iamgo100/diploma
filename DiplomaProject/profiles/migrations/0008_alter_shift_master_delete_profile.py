# Generated by Django 4.0.1 on 2022-05-20 08:04

from django.db import migrations, models
import profiles.models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
        ('profiles', '0007_shift_room'),
    ]

    operations = [
        migrations.AlterField(
            model_name='shift',
            name='master',
            field=models.ForeignKey(limit_choices_to={'role': 'E'}, on_delete=models.SET(profiles.models.get_deleted_user), to='main.profile', verbose_name='Мастер смены'),
        ),
        migrations.DeleteModel(
            name='Profile',
        ),
    ]
