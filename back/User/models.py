from django.db import models

# Create your models here.

class User(models.Model):
	openid = models.CharField(max_length=30, unique=True)
	unfinishedorders = models.CharField(max_length=15, blank=True)
	name  = models.CharField(max_length=10,blank=True)
	schoolid = models.CharField(max_length=14,blank=True)
	telephone = models.CharField(max_length=12,blank=True)
	dorm = models.CharField(max_length=15,blank=True)
	gender = models.IntegerField(blank=True,default=0)
	infocompleted = models.IntegerField(default=0)

class Place(models.Model):
	facultyid = models.IntegerField()
	name = models.CharField(max_length=20)
	x = models.FloatField()
	y = models.FloatField()

class Sessioninfo(models.Model):
	openid = models.CharField(max_length=30,primary_key=True)
	sessionkey = models.CharField(max_length=30,blank=True)
	session = models.CharField(max_length=50,unique=True,blank=True)