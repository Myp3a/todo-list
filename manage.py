#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import sys
from django.conf import settings
from django.core.management import execute_from_command_line
from django.core.wsgi import get_wsgi_application

path = '/srv/todo-list'
if path not in sys.path:
       sys.path.insert(0, path)

settings.configure(
    DEBUG=True,
    ROOT_URLCONF='todo.urls',
    SECRET_KEY = 'django-insecure-5co(lc@_ni)qf3^l67zs5&d$5dp+g^ats$jgjvxo%%y=2(-##m',
    INSTALLED_APPS = [
        'todo.apps.TodoConfig',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.staticfiles',
    ],
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'abyr',
            'HOST': '127.0.0.1',
            'PORT': '3306',
            'USER': 'root'
        }
    },
    STATIC_URL = 'static/',
    TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
    ],
    ALLOWED_HOSTS = ["todo.example.me"],
)

application = get_wsgi_application()

if __name__ == '__main__':
    execute_from_command_line(sys.argv)
