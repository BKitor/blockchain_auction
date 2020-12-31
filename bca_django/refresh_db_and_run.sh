#!/usr/bin/bash

rm db.sqlite3
python manage.py migrate
python manage.py loaddata user_fixture
python manage.py runserver