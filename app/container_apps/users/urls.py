from django.urls import path

from container_apps.users.views import *

app_name = 'users'

urlpatterns = [
    path('', UserListView.as_view(), name='lista_usuarios'),
    path('create', UserCreateView.as_view(), name='crear_usuario'),
    path('user/update/<int:pk>', UserUpdateView.as_view(), name='actualizar_usuario'),
    path('profile', UserProfileUpdateView.as_view(), name='update_profile_usuario'),
    path('change/password', UserChangePasswordView.as_view(), name='cambiar_contraseña_usuario'),
]
