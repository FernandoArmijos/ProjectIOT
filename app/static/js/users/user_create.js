$(function () {
    $('#UserForm').validate({
        rules: {
            first_name: {
                required: true,
            },
            last_name: {
                required: true,
            },
            username: {
                required: true,
                minlength: 5,
            },
            password: {
                required: true,
                minlength: 8,
            },
            email: {
                required: false,
                email: true,
            },
        },
        messages: {
            first_name: {
                required: "Este campo es obligatorio",
            },
            last_name: {
                required: "Este campo es obligatorio",
            },
            username: {
                required: "Este campo es obligatorio",
                minlength: "5 carácteres como mínimo. Únicamente letras, dígitos y @/./+/-/_"
            },
            password: {
                required: "Este campo es obligatorio",
                minlength: "Tu contraseña debe tener mínimo 8 caracteres"
            },
            email: {
                email: "Por favor, introduce una dirección de correo electrónico válida"
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

    bsCustomFileInput.init();
});