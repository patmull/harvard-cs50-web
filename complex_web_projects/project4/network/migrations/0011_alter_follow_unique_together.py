# Generated by Django 4.2.4 on 2023-08-23 16:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0010_remove_like_post_like_remove_like_user_like_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='follow',
            unique_together={('user_from', 'user_to')},
        ),
    ]
