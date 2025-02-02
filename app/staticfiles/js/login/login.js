//function for view password
function viewPass() {
    view.addEventListener("mousedown", () => {
        // Eliminamos su type del input
        id_password.removeAttribute("type");
    });
    view.addEventListener("mouseup", () => {
        // Agregamos type de input
        id_password.setAttribute("type", "password");
    });
}

$(function () {
    $('#LoginFormValidate').validate({
        rules: {
            username: {
                required: true,
            },
            password: {
                required: true,
            }
        },
        messages: {
            username: {
                required: "Por favor, introduzca el usuario",
            },
            password: {
                required: "Proporcione una contraseña",
            }
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