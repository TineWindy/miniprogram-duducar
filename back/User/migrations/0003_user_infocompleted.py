# Generated by Django 2.0.7 on 2018-10-29 11:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0002_auto_20181024_1301'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='infocompleted',
            field=models.IntegerField(default=0),
        ),
    ]
