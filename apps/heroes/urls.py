from django.urls import path
from . import views

urlpatterns = [
    path('', views.game_screen, name='game_screen'),
]