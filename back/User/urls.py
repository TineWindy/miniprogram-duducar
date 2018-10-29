from django.contrib import admin
from django.urls import path,include
from . import views

urlpatterns = [
	path('infosubmit/',views.userRegister.as_view(),name='log'),
	path('info/',views.User_getinfo,name='User_getinfo'),
	path('login/',views.userLogin.as_view(),name='getid'),
	# path('infochange/',views.userInfoChange.as_view()),
]
