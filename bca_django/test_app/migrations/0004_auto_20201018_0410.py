# Generated by Django 3.1.1 on 2020-10-18 04:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('test_app', '0003_auto_20201018_0409'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='publicProfile',
            field=models.BooleanField(default=False),
        ),
    ]
