function alert_error(obj) {
    var html = '';
    if (typeof (obj) === 'object') {
        html = '<div style = "text-aling: center;">';
        $.each(obj, function (key, value) {
            html += '<p>' + value + '</p>';
        });
        html += '</div>';
    } else {
        html += '<p>' + obj + '</p>';
    }
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        html: html,
        customClass: 'swal-wide',
    });
}