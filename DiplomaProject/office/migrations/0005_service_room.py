# Generated by Django 4.0.1 on 2022-06-02 18:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('office', '0004_remove_appointment_date_alter_appointment_shift'),
    ]

    operations = [
        migrations.AddField(
            model_name='service',
            name='room',
            field=models.CharField(choices=[('1', 'Парикмахерский'), ('2', 'Маникюрный')], default=1, max_length=1, verbose_name='Зал'),
            preserve_default=False,
        ),
    ]