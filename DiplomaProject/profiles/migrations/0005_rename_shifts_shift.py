# Generated by Django 4.0.1 on 2022-04-30 11:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0004_alter_profile_phone_number_shifts'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Shifts',
            new_name='Shift',
        ),
    ]
