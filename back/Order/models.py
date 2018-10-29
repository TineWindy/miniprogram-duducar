from django.db import models

# Create your models here.

class Order(models.Model):
	startplace = models.IntegerField()
	endplace = models.IntegerField()
	starttime = models.CharField(max_length=17)
	owner = models.CharField(max_length=30)
	passenger = models.CharField(max_length=30)
	fare = models.FloatField()
	notes = models.CharField(max_length=40,blank=True)
	assign = models.IntegerField(default=0)
	accomplish = models.IntegerField(default=0)

class Place(models.Model):
	#学部：1文理、2工、3信息学部
	school = models.IntegerField()
	name = models.CharField(max_length=15)
	coodinate = models.CharField(max_length=6)
