from django.urls import path

from container_apps.reports.views import *

app_name = 'reports'

urlpatterns = [
    path('', ReportsView.as_view(), name='reportes'),
]
