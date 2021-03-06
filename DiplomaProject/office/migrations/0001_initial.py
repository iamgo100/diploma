# Generated by Django 4.0.1 on 2022-05-22 14:27

from django.db import migrations, models
import django.utils.timezone
import office.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Shift',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateField(default=django.utils.timezone.now, verbose_name='Дата')),
                ('status', models.CharField(choices=[('N', 'Не подтверждено'), ('S', 'Подтверждено')], default='N', max_length=1, verbose_name='Статус смены')),
                ('room', models.CharField(choices=[('1', 'Парикмахерский'), ('2', 'Маникюрный')], default='1', max_length=1, verbose_name='Зал смены')),
                ('master', models.ForeignKey(limit_choices_to={'role': 'E'}, on_delete=models.SET(office.models.get_deleted_user), to='main.profile', verbose_name='Мастер смены')),
            ],
            options={
                'verbose_name': 'Смена',
                'verbose_name_plural': 'Смены',
            },
        ),
    ]
