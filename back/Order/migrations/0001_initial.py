# Generated by Django 2.0.7 on 2018-10-24 12:56

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('startplace', models.IntegerField()),
                ('endplace', models.IntegerField()),
                ('starttime', models.CharField(max_length=17)),
                ('owner', models.CharField(max_length=30)),
                ('passenger', models.CharField(max_length=30)),
                ('fare', models.FloatField()),
                ('assign', models.IntegerField(default=0)),
                ('accomplish', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Place',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('school', models.IntegerField()),
                ('name', models.CharField(max_length=15)),
                ('coodinate', models.CharField(max_length=6)),
            ],
        ),
    ]
