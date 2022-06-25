command = 'gunicorn'
pythonpath = '/home/www/code/project/project'
bind = '0.0.0.0:8000'
workers = 3
user = 'root'
limit_request_fields = 32000
limit_request_field_size = 0
raw_env = 'DJANGO_SETTINGS_MODULE=BeautyManageService.settings'