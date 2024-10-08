#! /bin/bash

# cd ./Game

python3 manage.py makemigrations && python3 manage.py migrate

python3 manage.py runserver 0.0.0.0:8001

#  CMD tail -f /dev/null
