from django.contrib import messages
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView, CreateView, UpdateView, TemplateView, FormView

from container_apps.users.forms import UserForm, UserUpdateForm, UserProfileForm, CustomPasswordChangeForm
from container_apps.users.models import User


class UserListView(ListView):
    model = User
    template_name = 'users/users_list.html'

    @method_decorator(csrf_exempt)
    @method_decorator(login_required())
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            messages.warning(request, 'Acceso denegado: solo los administradores pueden ver esta página.')
            return redirect('/')  # Reemplaza con la URL a la que deseas redirigir
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search_list_users':
                data = []
                for i in User.objects.all().order_by('-id'):
                    data.append(i.toJSON())
            elif action == 'delete_users':
                user = User.objects.get(pk=request.POST['id'])
                try:
                    user.delete()
                    messages.success(request, 'Usuario eliminado correctamente')
                except Exception as e:
                    messages.warning(request,
                                     'No se puede eliminar el usuario por que requeriría eliminar '
                                     'los objetos relacionados')
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(**kwargs)
        # context['create_url'] = reverse_lazy('user:crear_usuario')
        context['list_url'] = reverse_lazy('users:lista_usuarios')
        return context


class UserCreateView(CreateView):
    model = User
    form_class = UserForm
    template_name = 'users/user_create.html'
    success_url = reverse_lazy('users:lista_usuarios')

    @method_decorator(login_required())
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            messages.warning(request, 'Acceso denegado: solo los administradores pueden ver esta página.')
            return redirect('/')  # Reemplaza con la URL a la que deseas redirigir
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'create':
                form = self.get_form()
                data = form.save()
                if form.is_valid():
                    messages.success(request, 'Usuario registrado exitosamente')
            else:
                data['error'] = 'No ha ingresado a ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data)

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Crear Usuario'
        context['list_url'] = reverse_lazy('users:lista_usuarios')
        context['action'] = 'create'
        return context


class UserUpdateView(UpdateView):
    model = User
    form_class = UserUpdateForm
    template_name = 'users/user_create.html'
    success_url = reverse_lazy('users:lista_usuarios')

    @method_decorator(login_required())
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        if not request.user.is_superuser:
            messages.warning(request, 'Acceso denegado: solo los administradores pueden ver esta página.')
            return redirect('/')  # Reemplaza con la URL a la que deseas redirigir
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'update':
                form = self.get_form()
                data = form.save()
                if form.is_valid():
                    messages.success(request, 'Usuario actualizado exitosamente')
            else:
                data['error'] = 'No ha ingresado a ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data)

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Actualizar Usuario'
        context['create_url'] = reverse_lazy('users:actualizar_usuario', kwargs={'pk': self.object.pk})
        context['list_url'] = reverse_lazy('users:lista_usuarios')
        context['action'] = 'update'
        return context


class UserProfileUpdateView(UpdateView):
    model = User
    form_class = UserProfileForm
    template_name = 'users/user_profile.html'
    success_url = reverse_lazy('users:update_profile_usuario')

    @method_decorator(login_required())
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def get_object(self, queryset=None):
        return self.request.user

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST.get('action', '')
            if action == 'update':
                form = self.get_form()
                if form.is_valid():
                    form.save()
                    messages.success(request, 'Datos actualizados exitosamente')
                    data['success'] = True
                else:
                    data['errors'] = form.errors
            else:
                data['error'] = 'No ha ingresado a ninguna opción válida'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data)

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Perfil de usuario'
        context['list_url'] = reverse_lazy('users:update_profile_usuario')
        # context['change_password_url'] = reverse_lazy('user:cambiar_contraseña_usuario')
        context['action'] = 'update'
        return context


class UserChangePasswordView(FormView):
    model = User
    form_class = CustomPasswordChangeForm
    template_name = 'users/user_change_password.html'
    success_url = reverse_lazy('users:update_profile_usuario')

    @method_decorator(login_required())
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_form(self, form_class=None):
        form = CustomPasswordChangeForm(user=self.request.user)
        form.fields['old_password']
        form.fields['new_password1']
        form.fields['new_password2']
        return form

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'change_password':
                form = CustomPasswordChangeForm(user=request.user, data=request.POST)
                if form.is_valid():
                    form.save()
                    messages.success(request, 'Su contraseña se ha actualizado correctamente')
                    update_session_auth_hash(request, form.user)
                else:
                    data['error'] = form.errors
            else:
                data['error'] = 'No ha ingresado a ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data)

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Cambiar contraseña'
        context['list_url'] = reverse_lazy('users:update_profile_usuario')
        context['action'] = 'change_password'
        return context
