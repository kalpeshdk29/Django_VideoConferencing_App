from django.urls import path
from. import views

urlpatterns=[
    path('', views.home),
    path('lobby', views.lobby),
    path('room/', views.room)
]