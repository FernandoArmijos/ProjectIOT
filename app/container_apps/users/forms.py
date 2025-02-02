from django import forms
from django.contrib.auth.forms import PasswordChangeForm

from container_apps.users.models import User


class UserForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for form in self.visible_fields():
            form.field.widget.attrs['class'] = 'form-control'
        self.fields['image'].widget.attrs['class'] = 'form-control'

    class Meta:
        model = User
        fields = [
            'username',
            'first_name',
            'last_name',
            'email',
            'is_active',
            'is_superuser',
            'is_staff',
            'password',
            'image',
        ]
        exclude = ['last_login', 'user_permissions']

        widgets = {
            'username': forms.TextInput(attrs={
                'placeholder': 'Ingrese un nombre de usuario',
            }),
            'first_name': forms.TextInput(attrs={
                'placeholder': 'Ingrese un nombre'
            }),
            'last_name': forms.TextInput(attrs={
                'placeholder': 'Ingrese un apellido'
            }),
            'email': forms.EmailInput(attrs={
                'placeholder': 'EJ. sistemas@example.com'
            }),
            'password': forms.PasswordInput(attrs={
                'placeholder': 'Ingrese una contraseña'
            }),
            'image': forms.FileInput(),
        }

    def save(self, commit=True):
        data = {}
        form = super()
        try:
            if form.is_valid():
                contraseña = self.cleaned_data['password']
                usuario = form.save(commit=False)
                if usuario.pk is None:
                    usuario.set_password(contraseña)
                else:
                    usuario = User.objects.get(pk=usuario.pk)
                    if usuario.password != contraseña:
                        usuario.set_password(contraseña)
                usuario.save()
            else:
                data['error'] = form.errors
        except Exception as e:
            data['error'] = str(e)
        return data


class UserUpdateForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for form in self.visible_fields():
            form.field.widget.attrs['class'] = 'form-control'
        self.fields['image'].widget.attrs['class'] = 'form-control'

    class Meta:
        model = User
        fields = [
            'username',
            'first_name',
            'last_name',
            'email',
            'is_active',
            'is_superuser',
            'is_staff',
            'password',
            'image',
        ]
        exclude = ['last_login', 'user_permissions']

        widgets = {
            'username': forms.TextInput(attrs={
                'placeholder': 'Ingrese un nombre de usuario',
            }),
            'first_name': forms.TextInput(attrs={
                'placeholder': 'Ingrese un nombre'
            }),
            'last_name': forms.TextInput(attrs={
                'placeholder': 'Ingrese un apellido'
            }),
            'email': forms.EmailInput(attrs={
                'placeholder': 'EJ. sistemas@example.com'
            }),
            'password': forms.PasswordInput(render_value=True),
        }

    def save(self, commit=True):
        data = {}
        form = super()
        try:
            if form.is_valid():
                contraseña = self.cleaned_data['password']
                usuario = form.save(commit=False)
                if usuario.pk:
                    if User.objects.get(pk=usuario.pk).password != contraseña:
                        usuario.set_password(contraseña)
                usuario.save()
            else:
                data['error'] = form.errors
        except Exception as e:
            data['error'] = str(e)
        return data


class UserProfileForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for form in self.visible_fields():
            form.field.widget.attrs['class'] = 'form-control'
        self.fields['image'].widget.attrs['class'] = 'form-control'

    class Meta:
        model = User
        fields = [
            'username',
            'first_name',
            'last_name',
            'email',
            'image',
        ]
        exclude = [
            'last_login',
            'user_permissions',
            'groups',
            'password',
            'is_superuser',
            'is_staff',
            'is_active'
        ]

        widgets = {
            'username': forms.TextInput(attrs={
                'placeholder': 'Ingrese un nombre de usuario',
            }),
            'first_name': forms.TextInput(attrs={
                'placeholder': 'Ingrese un nombre'
            }),
            'last_name': forms.TextInput(attrs={
                'placeholder': 'Ingrese un apellido'
            }),
            'email': forms.EmailInput(attrs={
                'placeholder': 'EJ. sistemas@example.com'
            }),
        }

    # El método save ahora solo guarda los datos
    def save(self, commit=True):
        return super().save(commit=commit)


class CustomPasswordChangeForm(PasswordChangeForm):
    def __init__(self, *args, **kwargs):
        super(PasswordChangeForm, self).__init__(*args, **kwargs)
        self.fields['old_password'].widget.attrs['class'] = 'form-control'
        self.fields['old_password'].widget.attrs['placeholder'] = 'Ingrese la contraseña actual'
        self.fields['new_password1'].widget.attrs['class'] = 'form-control'
        self.fields['new_password1'].widget.attrs['placeholder'] = 'Ingrese la contraseña nueva'
        self.fields['new_password2'].widget.attrs['class'] = 'form-control'
        self.fields['new_password2'].widget.attrs['placeholder'] = 'Repita la contraseña nueva'