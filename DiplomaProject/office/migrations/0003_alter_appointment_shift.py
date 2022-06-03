# Generated by Django 4.0.1 on 2022-06-02 17:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('office', '0002_service_appointment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointment',
            name='shift',
            field=models.ForeignKey(limit_choices_to={'date': '<django.db.models.fields.DateField>'}, null=True, on_delete=django.db.models.deletion.SET_NULL, to='office.shift', verbose_name='Смена'),
        ),
    ]
