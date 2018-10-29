from django.shortcuts import render
from django.http import HttpRequest,HttpResponse
from User.models import User,Sessioninfo
from django.views.decorators.csrf import csrf_exempt,csrf_protect
from django.utils.decorators import method_decorator
from django.views import View
import hashlib
import requests
import json
# Create your views here.from .models import User

class userSessionQuery():
	@classmethod
	def sessionToOpenid(cls,session):
		user = Sessioninfo.objects.filter(session=session)
		if len(user)==0:
			return None
		user = user[0]
		return user.openid

	@classmethod
	def sessionCheck(cls,request):
		'''

		:param request:
		:return:None,None if no session in header;(session,openid) else.
		'''
		try:
			session = request.META['HTTP_SESSION']
			openid = userSessionQuery.sessionToOpenid(session)
		except:
			return None,None
		return session,openid

class userLogin(View):

	appid = 'wxd084ea382782a63e'
	secret = '51c1e72f0273bd70e54eafeca480d4b7'
	grant_type = 'authorization_code'

	def getUserId(self,code):           
		# construct openid query url
		url = 'https://api.weixin.qq.com/sns/jscode2session?appid='+self.appid+'&secret='+self.secret+'&js_code='+code+'&grant_type='+'authorization_code'
		#query openid
		wx = requests.get(url).content
		#convert the format of result
		if(type(wx)==bytes):
			wx = str(wx,encoding='utf-8')
		wx = wx.replace("'",'"')
		wxjson = json.loads(wx)

		return wxjson

	def get(self,request):
		res = HttpResponse()

		get = request.GET
		if('code' in get):
			code = request.GET['code']
		else:
			res.write({"error":1002,"data":{'info':"Please request with right json_code."}})
			return res

		codejson = self.getUserId(code)
		if('errcode' in codejson):
			res.write({"error":1002,"data":{'info':"Please request with right json_code."}})
			return res
		else:
			openid = codejson['openid']
			sessionkey = codejson['session_key']
			session = openid + sessionkey
			session = hashlib.sha1(session.encode(encoding="utf-8")).hexdigest()

			if len(Sessioninfo.objects.filter(openid=openid)) == 0:
				se = Sessioninfo(openid=openid,sessionkey=sessionkey,session=session)
				se.save()
				user = User(openid=openid)
				user.save()
				print('asdasdasd')
			else:
				se = Sessioninfo.objects.filter(openid=openid)[0]
				se.sessionkey = sessionkey
				se.session = session
				se.save()
				print('No!!!!!!')

			res.write({"error":0,"data":{"openid":openid,"session":session}})
		return res


class userRegister(View):
	'''
		用户信息注册或修改
	'''

	name = ''
	schoolid = ''
	telephone = ''
	openid = ''

	@classmethod
	def is_existed(cls,openid):
		if(len(User.objects.filter(openid=openid))!=0):
			return True
		else:
			return False

	def is_right_format(self,req):
		if req.content_type!='application/x-www-form-urlencoded':
			return False
		else:
			return True

	def is_paras_enough(self,data):
		if ('name' in data) and ('schoolid' in data) and ('telephone' in data) and ('dorm' in data) and ('gender' in data):
			return True
		else:
			return False

	
	@method_decorator(csrf_exempt)
	# @method_decorator(csrf_protect)
	def post(self,request):
		res = HttpResponse()
		res.__setitem__('Access-Control-Allow-Origin','*')
		res.__setitem__("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
		res.__setitem__("Access-Control-Allow-Headers", "x-requested-with");

		if not self.is_right_format(request):
			msg = {'error':1001,'data':{'info':'Content_type should be application/x-www-form-urlencoded'}}
			res.write(msg)
			return res

		data = request.POST
		if not self.is_paras_enough(data):
			msg = {'error':1002,'data':{'info':'Paras are not enough'}}
			res.write(msg)
			return res

		try:
			session = request.META.__getitem__('HTTP_SESSION')
			openid = userSessionQuery.sessionToOpenid(session)
		except:
			res.write({'error' : 1000,'data' : {'info' : 'Please login'}})
			return res

		name = data.__getitem__('name')
		schoolid = data.__getitem__('schoolid')
		telephone = data.__getitem__('telephone')
		dorm = data.__getitem__('dorm')
		gender = int(data.__getitem__('gender'))

		print(openid)
		if openid==None or not userRegister.is_existed(openid):
			res.write({'error':1003,'data':{'info':'User does not existed'}})
			return res

		user = User.objects.filter(openid=openid)[0]
		user.name = name
		user.schoolid = schoolid
		user.telephone = telephone
		user.dorm = dorm
		user.gender = gender
		user.infocompleted = 1
		user.save()

		msg = {'error':0000,'data':{'info':'Success to submit information'}}
		res.write(msg)
		return res

class userInfoChange(View):

	def infoChange(self,openid,info):
		user = User.objects.filter(openid=openid)
		if(len(user)==0):
			return 0
		user = user[0]
		user.name = info['name'] if ('name' in info) else user.name
		user.telephone = info['telephone'] if ('telephonee' in info) else user.telephone
		user.dorm = info['dorm'] if ('dorm' in info) else user.dorm
		user.save()
		return 1

	def post(self,request):
		res = HttpResponse()
		res.__setitem__('Access-Control-Allow-Origin', '*')
		post = request.POST
		print(post)
		if (not 'openid' in post) or self.infoChange(post['openid'],post)==0:
			res.write({'error':1003,'data':{'info':'This openid does not exist'}})
		else:
			res.write({'error':0,'data':{'info':'Success to change'}})
		return res








def User_getinfo(request):
	# get
	# session demanded in header
	res = HttpResponse()
	res.__setitem__('content-type','application/json')

	try:
		session = request.META.__getitem__('HTTP_SESSION')
		openid = userSessionQuery.sessionToOpenid(session)
	except:
		res.write({'error': 1000, 'data': {'info': 'Please login'}})
		return res

	if 'openid' in request.GET:
		openid = request.GET['openid']

	user = User.objects.filter(openid=openid)
	if(len(user)==0):
		res.write({'error':1004,'data':{'info':'No user has the openid inputed'}})
	else:
		user = user[0]
		data = {
			"name" : user.name,
			"schoolid" : user.schoolid,
			"telephone" : user.telephone,
			"openid" : user.openid,
			"dorm" : user.dorm,
			"gender" : user.gender,
			"unfinishedorders" : user.unfinishedorders,
			"infocompleted" : user.infocompleted
		}
		res.write({"error":0000,"data":data})
	return res


# a = userOpenid()
# json = a.getOpenid('033ldvJq0YOAwo1SYeIq0FCuJq0ldvJz')
# print(json)

