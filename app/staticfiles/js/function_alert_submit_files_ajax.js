function submit_files_with_ajax(url, icon, title, content, parameters, callback) {
    $.confirm({
        icon: icon,
        title: title,
        content: content,
        theme: 'bootstrap',
        //type: 'blue',
        //typeAnimated: true,
        buttons: {
            info: {
                text: 'Sí',
                btnClass: 'btn-primary',
                action: function () {
                    $.ajax({
                        url: url,
                        type: 'POST',
                        data: parameters,
                        dataType: 'json',
                        // usado para las vistas que no deshabilita el csrf_token en el metodo dispatch
                        headers: {
                            'X-CSRFToken': csrftoken
                        },
                        processData: false,
                        contentType: false,
                    }).done(function (data) {
                        if (!data.hasOwnProperty('error')) {
                            callback(data);
                            return false;
                        }
                        // error alert messages with the ajax
                        // function_alert_error
                        alert_error(data.error);
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        alert(textStatus + ': ' + errorThrown);
                    }).always(function (data) {

                    });
                }
            },
            danger: {
                text: "No",
                btnClass: 'btn-danger',
                action: function () {

                }
            }
        }
    });
}