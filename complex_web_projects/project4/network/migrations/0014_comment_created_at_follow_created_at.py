# Generated by Django 4.2.4 on 2023-08-25 11:01

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0013_comment_post'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2023, 8, 25, 11, 1, 7, 140381)),
        ),
        migrations.AddField(
            model_name='follow',
            name='created_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
