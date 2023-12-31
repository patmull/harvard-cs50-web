# Generated by Django 4.2.4 on 2023-08-09 12:17

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category_name', models.CharField(max_length=128)),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=512)),
                ('users', models.ManyToManyField(related_name='users', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Bid',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price', models.IntegerField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='AuctionListing',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item_name', models.CharField(max_length=128)),
                ('created_at', models.DateTimeField()),
                ('starting_bid', models.FloatField()),
                ('image_url', models.CharField(blank=True, max_length=512)),
                ('category', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='category', to='auctions.category')),
                ('users', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='users_auction_listing', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
