# Generated by Django 2.0.7 on 2018-10-24 13:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='wxid',
            new_name='openid',
        ),
    ]
