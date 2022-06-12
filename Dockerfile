FROM python:3.10-alpine
WORKDIR /app
RUN python -m pip install --upgrade pip
RUN pip install django
RUN pip install uwsgi
RUN pip install python-3.10-dev
RUN apt-get install nginx
COPY ./DiplomaProjec/t /app/
COPY ./nginx/ /app/
COPY ./beautymanage.ru_nginx.conf /app/etc/nginx/sites-available/
RUN ln -s /etc/nginx/sites-available/mysite_nginx.conf /etc/nginx/sites-enabled/
CMD [ "/etc/init.d/nginx", "start" ]