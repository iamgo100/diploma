# Generated by Django 4.0.1 on 2022-06-03 18:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('office', '0007_alter_appointment_shift'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointment',
            name='date',
            field=models.DateField(help_text='Введите дату в формате: 01.01.2001', verbose_name='Дата'),
        ),
    ]