from django.shortcuts import render
from django.http import HttpRequest,HttpResponse
from .models import Order,Place
from User.views import userRegister,userSessionQuery
from django.views.decorators.csrf import csrf_exempt,csrf_protect
from django.utils.decorators import method_decorator
from django.views import View
import requests
import json


# Create your views here.


class orderCreate(View):
	startplace = 0
	endplace = 0
	starttime = '####-##-##_##:##'
	owner = ''
	passenger = ''
	fare = 0.0
	notes = ''

	def timeFormatRight(self,time):
		# inspect if the format of time is true
		# true format is ####-##-##_##:##
		if time[4]==time[7]=='-' and time[10]=='_' and time[13]==':':
			return True
		return False

	def post(self,request):
		res = HttpResponse()
		req = request.POST


		# detect whether request carry session
		session,openid = userSessionQuery.sessionCheck(request)
		if session == None:
			res.write({'error' : 1000,'data' : {'info' : 'Please login'}})
			return res

		if('startplace' in req) and ('endplace' in req) and ('starttime' in req) and ('fare' in req) and ('identity' in req):
			if not self.timeFormatRight(req['starttime']):
				res.write({'error':1002,'data':{'info':'Wrong time fomat'}})
				return res
			user = userRegister()

			if(req['identity']==0):
				self.owner = openid
			else:
				self.passenger = openid

			self.startplace = int(req['startplace'])
			self.endplace = int(req['endplace'])
			self.starttime = req['starttime']
			self.fare = float(req['fare'])
			try:
				self.notes = req['notes']
			except:
				pass


			order = Order(startplace=self.startplace,endplace=self.endplace,starttime=self.starttime,owner=self.owner,passenger=self.passenger,fare=self.fare,notes=self.notes)
			order.save()

			res.write({'error':0000,'data':{'orderid':order.id}})
		else:
			res.write({'error':1002,'data':{'info':"Paras are not enough"}})
		return res

class orderInfo(View):
	orderid = 1

	@classmethod
	def is_existed(cls,orderid):
		orders = Order.objects.all()
		try:
			order = orders.get(id=orderid)
		except:
			return None
		else:
			return order

	def get(self,request,orderid):
		res = HttpResponse()

		# detect whether request carry session
		session, openid = userSessionQuery.sessionCheck(request)
		if session == None:
			res.write({'error': 1000, 'data': {'info': 'Please login'}})
			return res

		try:
			order =  orderInfo.is_existed(orderid)
			data = {
				'startplace' : order.startplace,
				'endplace' : order.endplace,
				'starttime' : order.starttime,
				'owner' : order.owner,
				'passenger' : order.passenger,
				'fare' : order.fare,
				'notes' : order.notes
			}
		except:
			res.write({'error':1003,'data':{'info':'No order matches the id.'}})
			return res

		res.write({'error':0,'data':data})
		return res

class orderMatch(View):

	def is_passenger(self,sourceorder):
		'''
		判断源订单主是否为乘客
		参数为订单querydict
		'''
		if sourceorder.passenger == '':
			return False
		else:
			return True

	def get(self,request):
		'''
		get参数为sourceorderid，goalorderid
		'''
		res = HttpResponse()

		# detect whether request carry session
		session, openid = userSessionQuery.sessionCheck(request)
		if session == None:
			res.write({'error': 1000, 'data': {'info': 'Please login'}})
			return res

		getData = request.GET
		sourceorderid = getData['sourceorderid']
		goalorderid = getData['goalorderid']
		sourceorder = orderInfo.is_existed(sourceorderid)
		goalorder = orderInfo.is_existed(goalorderid)
		if goalorder == None or sourceorder == None:
			res.write(sourceorder)
			# res.write({'error':1002,'data':{'info':'Wrong order_id'}})
			return res
		if self.is_passenger(sourceorder):
			goalorder.passenger = sourceorder.passenger
			goalorder.assign = 1
			goalorder.save()
			# sourceorder.delete()
		else:
			goalorder.owner = sourceorder.owner
			goalorder.assign = 1
			goalorder.save()
			# sourceorder.delete()

		data = {
			'orderid' : goalorder.id,
			'startplace' : goalorder.startplace,
			'endplace' : goalorder.endplace,
			'starttime' : goalorder.starttime,
			'owner' : goalorder.owner,
			'passenger' : goalorder.passenger,
			'fare' : goalorder.fare
		}

		res.write({'error':0000,'data':data})
		return res

# class orderUnfinished(View):







