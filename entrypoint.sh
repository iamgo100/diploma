#!/bin/sh

python manage.py migrate --no-input
python manage.py collectstatic --no-input

gunicorn BeautyManageService.wsgi:application --bind beautymanage.ru:8000