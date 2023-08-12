# Generated by Django 4.2.4 on 2023-08-11 10:22

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0006_auctionlisting_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='auctionlisting',
            name='closing_on',
            field=models.DateTimeField(default=datetime.datetime(2023, 9, 10, 10, 22, 7, 512240)),
        ),
        migrations.CreateModel(
            name='AuctionWinner',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='auctions.bid')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='auctionlisting',
            name='auction_winner',
            field=models.OneToOneField(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='auction_winner', to='auctions.auctionwinner'),
        ),
    ]