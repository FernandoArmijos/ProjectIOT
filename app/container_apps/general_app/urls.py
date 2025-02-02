from django.urls import path

from container_apps.general_app.views import *
from . import views

app_name = 'general_app'

urlpatterns = [
    path('', IndexView.as_view(), name='inicio'),
    path('get_latest_data/', views.IndexView.get_latest_data, name='get_latest_data'),
]
