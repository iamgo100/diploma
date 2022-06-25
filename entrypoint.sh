#!/bin/sh

python manage.py migrate --no-input
python manage.py collectstatic --no-input

gunicorn BeautyManageService.wsgi:application --bind 5.53.125.221:8000