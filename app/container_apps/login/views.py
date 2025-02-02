from django.contrib import messages
from django.contrib.auth import logout
from django.contrib.auth.views import LoginView, LogoutView
from django.shortcuts import render, redirect
from config import settings

# Create your views here.
class LoginFormView(LoginView):
    template_name = 'login/login.html'

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect(settings.LOGIN_REDIRECT_URL)
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        response = super().form_valid(form)
        messages.info(self.request, f'Bienvenid@ {self.request.user.first_name} {self.request.user.last_name} '
                                    f'ahora puedes continuar con tus actividades')
        return response

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context