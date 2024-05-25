from django.urls import path
from . import views

urlpatterns = [
    path('search_videos/', views.search_videos, name='search_videos'),
    path('', views.main, name='main'),
]
