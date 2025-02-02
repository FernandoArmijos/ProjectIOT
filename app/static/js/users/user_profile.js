$(function () {
    $('#btnUpdateUser').on('click', function () {
        $('#modal_user_edit').modal('show');
        //reiniciar modal de editar usuario
        $('#UserProfileForm')[0].reset();
    });

    $("#modal_user_edit").on("shown.bs.modal", function () {
        $(".alert-dismissible").fadeTo(8000, 500).slideUp(500, function () {
            $(".alert-dismissible").alert('close');
        });
    });

    // Forzar cierre del modal cuando se hace clic en el botón "Cancelar"
    $('.btn-danger').on('click', function () {
        $('#modal_user_edit').modal('hide');
    });

    $('form').on('submit', function (e) {
        e.preventDefault();

        if ($('input[name="first_name"]').val().length == 0 && $('input[name="last_name"]').val().length == 0) {
            alert_error('<p>Este campo es obligatorio.</p>' + 'Este campo es obligatorio.');
            return false;
        } else if ($('input[name="first_name"]').val().length == 0 || $('input[name="last_name"]').val().length == 0) {
            alert_error('Este campo es obligatorio.');
            return false;
        }

        var parameters = new FormData(this);
        submit_files_with_ajax(
            window.location.pathname,
            'text-primary fa fa-info',
            'Confirmación!',
            '¿Estás seguro que deseas realizar esta acción?',
            parameters,
            function () {
                location.href = '/users/profile';
            }
        );
    });

    $('#UserProfileForm').validate({
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
            email: {
                required: false,
                email: true,
            },
        },
        messages: {
            first_name: {
                required: "Este campo es obligatorio"
            },
            last_name: {
                required: "Este campo es obligatorio"
            },
            username: {
                required: "Este campo es obligatorio",
                minlength: "5 carácteres como mínimo. Únicamente letras, dígitos y @/./+/-/_"
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