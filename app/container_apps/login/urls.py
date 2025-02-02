from django.contrib.auth.views import LogoutView
from django.urls import path

from container_apps.login.views import *

app_name = 'login'

urlpatterns = [
    path('', LoginFormView.as_view(), name='iniciar_sesion'),
    path('logout/', LogoutView.as_view(), name='cerrar_sesion'),
]
