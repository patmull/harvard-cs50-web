# Generated by Django 4.2.4 on 2023-08-08 08:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flights', '0010_rename_name_passenger_first_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='passenger',
            name='flights',
            field=models.ManyToManyField(blank=True, related_name='passengers', to='flights.flight'),
        ),
    ]
