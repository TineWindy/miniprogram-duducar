from django.contrib import admin
from django.urls import path,include
from . import views


urlpatterns = [
	path('create/',views.orderCreate.as_view(),name='create'),
	path('info/<int:orderid>/',views.orderInfo.as_view(orderid=2)),
	path('match/',views.orderMatch.as_view()),
]
