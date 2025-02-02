var TblUser

function GetData() {
    TblUser = $('#table_users_list').DataTable({
        searching: true,
        responsive: true,
        lengthChange: true,
        ordering: true,
        autoWidth: false,
        destroy: true,
        deferRender: true,
        order: [[1, 'asc']],
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'search_list_users'
            },
            dataSrc: "",
            //usado en caso de que la vista no desabilite el metodo csrf_exempt
            headers: {
                'X-CSRFToken': csrftoken
            },
        },
        columns: [
            {"data": "image"},
            {"data": "username"},
            {"data": "full_name"},
            {"data": "last_login"},
            {"data": "is_active"},
            {"data": "is_superuser"},
            {"data": "id"}
        ],
        columnDefs: [
            {
                targets: [0],
                class: 'text-center',
                orderable: true,
                render: function (data, type, row) {
                    return '<div align="center" valign="middle"><img src="' + row.image + '" class="img-circle d-block" style="width: 20px; height: 20px;"></div>';
                }
            },
            {
                targets: [2],
                class: 'text-center',
                orderable: true,
                render: function (data, type, row) {
                    return data ? data : '--------'; // Si hay datos, muestra el contenido; de lo contrario, una cadena vacía.
                }
            },
            {
                targets: [3],
                class: 'text-center',
                orderable: true,
                render: function (data, type, row) {
                    if (data) {
                        return data;
                    } else {
                        return 'Nunca';
                    }
                }
            },
            {
                targets: [4],
                class: 'text-center',
                orderable: true,
                render: function (data, type, row) {
                    if (data === true) {
                        return '<span class="badge bg-success">' + '&nbsp;&nbsp;' + 'Activo' + '&nbsp;&nbsp;' + '</span>';
                    } else if (data === false) {
                        return '<span class="badge bg-danger">' + '&nbsp;&nbsp;' + 'Inactivo' + '&nbsp;&nbsp;' + '</span>';
                    }
                }
            },
            {
                targets: [5],
                class: 'text-center',
                orderable: true,
                render: function (data, type, row) {
                    if (data === true) {
                        return '<span class="badge bg-success">' + '&nbsp;&nbsp;' + 'SI' + '&nbsp;&nbsp;' + '</span>';
                    } else if (data === false) {
                        return '<span class="badge bg-danger">' + '&nbsp;&nbsp;' + 'NO' + '&nbsp;&nbsp;' + '</span>';
                    }
                }
            },
            {
                targets: [-1],
                class: 'text-center',
                orderable: true,
                render: function (data, type, row) {
                    var url_update = '/users/user/update/' + row.id;
                    var buttons = `
                        <a href="${url_update}" class="btn btn-warning btn-sm">
                            <i class="fas fa-edit"></i>
                        </a>
                        <a rel="delete_user" class="btn btn-danger btn-sm">
                            <i class="fas fa-trash"></i>
                        </a>`;
                    return buttons;
                }
            },
        ],
        language: {
            processing: "Procesando",
            search: "Buscar:",
            lengthMenu: "Mostrar _MENU_ registros",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            buttons: {
                colvis: "Columnas Visibles",
            }
        },
        dom: '<"row"' +
            '<"col-sm-12 col-md-6 mb-3"l><"col-sm-12 col-md-6"f>>' +
            '<"col-sm-12 col-md-6:eq(0)"><"dt-buttons btn-group flex-wrap"B>' +
            't' +
            '<"row"' +
            '<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        buttons: [
            {
                //COPY
                extend: 'copy',
                text: '<i class="fas fa-copy"></i> Copiar',
                title: 'Lista de usuarios',
                exportOptions: {
                    columns: ':visible'
                },
                className: 'btn btn-light'
            },
            {
                //PRINT
                extend: 'print',
                text: '<i class="fas fa-print"></i> Imprimir',
                title: 'Lista de usuarios',
                exportOptions: {
                    columns: ':visible'
                },
                className: 'btn btn-light'
            },
            {
                //COLVIS
                extend: 'colvis',
                columnText: function (dt, idx, title) {
                    return title;
                },
                className: 'btn btn-light'
            },
        ]
    });
}

$(function () {

    GetData();

    $('#table_users_list tbody')
        .on('click', 'a[rel="delete_user"]', function (e) {
            e.preventDefault();
            var tr = TblUser.cell($(this).closest('td, li')).index();
            var data = TblUser.row(tr.row).data();
            var parameters = new FormData();
            parameters.append('action', 'delete_users');
            parameters.append('id', data.id);
            submit_files_with_ajax(
                window.location.pathname,
                'text-danger fas fa-exclamation-triangle',
                'Alerta!',
                '¿Estás seguro que deseas eliminar el siguiente registro?',
                parameters,
                function () {
                    TblUser.ajax.reload();
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito!',
                        html: "<div class='swal2-html-container'>Usuario eliminado correctamente</div><br>",
                        timer: 2000,
                        showCancelButton: false,
                        showConfirmButton: false,
                        customClass: 'swal-wide',
                    });
                });
        });
});