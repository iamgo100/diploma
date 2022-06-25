#!/bin/sh

python manage.py migrate --no-input
python manage.py collectstatic --no-input

# gunicorn BeautyManageService.wsgi:application --bind 0.0.0.0:8000
exec gunicorn -c "/DiplomaProject/gunicorn_config.py" BeautyManageService.wsgi