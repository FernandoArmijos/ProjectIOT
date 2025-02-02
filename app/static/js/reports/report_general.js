var date_range = null;
var date_now = new moment().format('YYYY-MM-DD HH:mm');

function generate_report_general() {
    var parameters = {
        'action': 'report_general',
        'start_date': date_now,
        'end_date': date_now,
    };

    if (date_range !== null) {
        parameters['start_date'] = date_range.startDate.format('YYYY-MM-DD HH:mm');
        parameters['end_date'] = date_range.endDate.format('YYYY-MM-DD HH:mm');
    }

    $('#table_report_general').DataTable({
        searching: true,
        responsive: true,
        lengthChange: true,
        ordering: false,
        autoWidth: false,
        destroy: true,
        deferRender: true,
        pageLength: 20, // Número de filas por página
        lengthMenu: [5, 10, 20, 50, 100], // Opciones disponibles en el menú desplegable
        ajax: {
            url: window.location.pathname, // Enviar la solicitud al endpoint actual
            type: 'POST',
            data: parameters,
            dataSrc: "" // Los datos devueltos son una lista JSON
        },
        columns: [
            {
                data: 'created_at',
                title: 'Fecha',
                render: function (data, type, row) {
                    // Formatea la fecha usando moment.js
                    return moment(data).format('YYYY-MM-DD HH:mm:ss'); // Solo fecha y hora con minutos
                }
            },
            {data: 'inner_temp', title: 'Temperatura Interna (°C)'},
            {data: 'outer_temp', title: 'Temperatura Externa (°C)'},
            {data: 'inner_hum', title: 'Humedad Interna (%)'},
            {data: 'outer_hum', title: 'Humedad Externa (%)'},
            {data: 'soil_hum', title: 'Humedad del Suelo (%)'},
            {data: 'co2'},
            {data: 'ch4'},
            {data: 'n2o'},
        ],
        columnDefs: [
            {
                targets: [1, 2, 3, 4, 5, 6, 7, 8],
                class: 'text-center',
                render: function (data, type, row) {
                    return data;
                }
            },
        ],
        initComplete: function (settings, json) {

        },
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
                colvis: "Mostrar/Ocultar Columnas",
                colvisRestore: "Restaurar Visibilidad" // Traducción personalizada
            }
        },
        dom: '<"col-sm-12 col-md-12 pl-0 pb-3"B>' +
            '<"row"' +
            '<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>' +
            't' +
            '<"row"' +
            '<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        buttons: [
            {
                //EXCEL
                extend: 'excelHtml5',
                text: '<i class="text-white fas fa-file-excel"></i> Descargar Excel',
                title: 'Reporte General de Datos',
                messageTop: 'Generado desde ' + parameters['start_date'] + ' ' + 'hasta ' + parameters['end_date'],
                exportOptions: {
                    columns: ':visible' // Exporta solo las columnas visibles
                },
                className: 'btn btn-success'
            },
            {
                //PDF
                extend: 'pdf',
                text: '<i class="text-white fas fa-file-pdf"></i> Descargar PDF',
                title: 'Reporte General de Datos',
                pageSize: 'A4',
                orientation: 'landscape',
                download: 'open',
                exportOptions: {
                    columns: ':visible' // Exporta solo las columnas visibles
                },
                className: 'btn btn-danger',
                customize: function (doc) {
                    // Filtrar las filas visibles de la tabla
                    const visibleColumns = doc.content[1].table.body[0].length;
                    // Si tienes un número de columnas específico, puedes calcular los anchos automáticamente
                    const columnWidth = (100 / visibleColumns).toFixed(2) + '%';
                    // Ajustar los anchos de las columnas al 100% del ancho disponible
                    doc.content[1].table.widths = Array(visibleColumns).fill(columnWidth);
                    //doc.content[1].table.widths = Array(doc.content[1].table.body[0].length).fill('auto');
                    //doc.content[1].table.widths = ['15%', '11%', '11%', '11%', '11%', '11%', '10%', '10%', '10%'];
                    doc['footer'] = (function (page, pages) {
                        return {
                            columns: [
                                {
                                    alignment: 'left',
                                    text: ['Generado desde ' + parameters['start_date'] + ' ' + 'hasta ' + parameters['end_date']],
                                },
                                {
                                    alignment: 'right',
                                    text: ['Página ', {text: page.toString()}, ' de ', {text: pages.toString()}]
                                }
                            ],
                            margin: [30, 10]
                        }
                    });
                }
            },
            {
                //PRINT
                extend: 'print',
                //messageTop: 'Generado desde ' + parameters['start_date'] + ' ' + 'hasta ' + parameters['end_date'],
                text: '<i class="text-white fas fa-print"></i> Imprimir Reporte',
                title: 'Reporte General de Datos',
                exportOptions: {
                    columns: ':visible' // Exporta solo las columnas visibles
                },
                className: 'btn bg-primary border-primary'
            },
            {
                // Column Visibility
                extend: 'colvis',
                text: '<i class="text-white fas fa-eye"></i> Mostrar/Ocultar Columnas',
                className: 'btn btn-secondary btn-sm',
                postfixButtons: ['colvisRestore'] // Agrega la opción de restaurar la configuración original
            }
        ]
    });
}

$(function () {
    $('input[name="date_range"]').daterangepicker({
        timePicker: true, // Habilitar selección de hora
        timePicker24Hour: true, // Usar formato 24 horas
        timePickerIncrement: 5, // Incrementos de 10 minutos
        applyButtonClasses: 'btn-primary',
        cancelButtonClasses: 'btn-danger',
        locale: {
            format: 'YYYY-MM-DD',
            applyLabel: 'Aplicar',
            cancelLabel: 'Cancelar',
            fromLabel: 'Desde',
            toLabel: 'Hasta',
            separator: ' - ',
            customRangeLabel: 'Custom',
            daysOfWeek: [
                "Dom",
                "Lun",
                "Mar",
                "Mie",
                "Jue",
                "Vie",
                "Sáb"
            ],
            monthNames: [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre"
            ],
            firstDay: 0
        }
    }).on('apply.daterangepicker', function (ev, picker) {
        date_range = picker;
        generate_report_general();
    }).on('cancel.daterangepicker', function (ev, picker) {
        $(this).data('daterangepicker').setStartDate(date_now);
        $(this).data('daterangepicker').setEndDate(date_now);
        date_range = picker;
        generate_report_general();
    });

    generate_report_general();
});