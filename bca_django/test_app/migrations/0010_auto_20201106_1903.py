# Generated by Django 3.1.1 on 2020-11-06 19:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('test_app', '0009_auto_20201106_1859'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sealedbid',
            name='end_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
