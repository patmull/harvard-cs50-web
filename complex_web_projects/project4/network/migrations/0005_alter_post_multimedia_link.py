# Generated by Django 4.2.4 on 2023-08-22 21:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0004_post_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='multimedia_link',
            field=models.URLField(blank=True, max_length=1000),
        ),
    ]