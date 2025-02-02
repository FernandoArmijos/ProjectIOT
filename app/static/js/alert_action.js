//Notificación para eliminar items de productos de la venta
function alert_action(icon, title, content, callback, cancel) {
    $.confirm({
        theme: 'bootstrap',
        title: title,
        icon: icon,
        content: content,
        buttons: {
            info: {
                text: "Sí",
                btnClass: 'btn-primary',
                action: function () {
                    callback();
                }
            },
            danger: {
                text: "No",
                btnClass: 'btn-danger',
                action: function () {
                    cancel();
                }
            }
        }
    });
}