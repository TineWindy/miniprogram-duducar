# Generated by Django 2.0.7 on 2018-10-29 11:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Order', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='notes',
            field=models.CharField(blank=True, max_length=40),
        ),
    ]