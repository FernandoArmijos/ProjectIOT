//funcion para ver la contraseña
function viewPass() {
    view.addEventListener("mousedown", () => {
        // Eliminamos su type del input
        id_new_password2.removeAttribute("type");
        id_new_password1.removeAttribute("type");
        id_old_password.removeAttribute("type");
    });
    view.addEventListener("mouseup", () => {
        // Agregamos type de input
        id_new_password2.setAttribute("type", "password");
        id_new_password1.setAttribute("type", "password");
        id_old_password.setAttribute("type", "password");
    });
}

$(function () {
    $('#ChangePasswordForm').validate({
        rules: {
            old_password: {
                required: true,
            },
            new_password1: {
                required: true,
                minlength: 8
            },
            new_password2: {
                required: true,
                minlength: 8,
                equalTo: "#id_new_password1",
            },
        },
        messages: {
            old_password: {
                required: "Este campo es obligatorio"
            },
            new_password1: {
                required: "Este campo es obligatorio",
                minlength: "Esta contraseña es demasiado corta. Debe contener al menos 8 caracteres."
            },
            new_password2: {
                required: "Este campo es obligatorio",
                minlength: "Esta contraseña es demasiado corta. Debe contener al menos 8 caracteres.",
                equalTo: "Las contraseñas no coinciden. Favor de verificar",
            },
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });

    viewPass();
});