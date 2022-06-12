FROM python:3.10-alpine
WORKDIR /app
RUN sudo python -m pip install --upgrade pip
RUN sudo pip install django
RUN sudo pip install uwsgi
RUN sudo pip install python-3.10-dev
RUN sudo apt-get install nginx
COPY ./DiplomaProjec/t /app/
COPY ./nginx/ /app/
COPY ./beautymanage.ru_nginx.conf /app/etc/nginx/sites-available/
RUN sudo ln -s /etc/nginx/sites-available/mysite_nginx.conf /etc/nginx/sites-enabled/
CMD [ "/etc/init.d/nginx", "start" ]