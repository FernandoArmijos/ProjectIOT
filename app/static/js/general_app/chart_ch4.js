var lang_option = {
    viewFullscreen: "Ver en pantalla completa",
    exitFullscreen: "Salir de pantalla completa",
    printChart: "Tabla de impresión",
    downloadJPEG: "Descargar imagen JPG",
    downloadPDF: "Descargar documento PDF",
    downloadPNG: "Descargar imagen PNG",
    downloadSVG: "Descargar imagen vectorial SVG",
    downloadCSV: "Descargar CSV",
    downloadXLS: "Descargar XLS",
    viewData: "Ver tabla de datos"
};

// Configuración inicial del gráfico
var chart_ch4 = Highcharts.chart('container_chart_ch4', {
    chart: {
        height: 400,
        type: 'column',
        zooming: {
            type: 'x'
        },
        panning: true,
        panKey: 'shift',
        scrollablePlotArea: {
            minWidth: 600
        }
    },
    title: {
        text: 'CH₄',
        style: {
            fontSize: '14px'
        }
    },
    lang: lang_option,
    credits: {
        enabled: false
    },
    xAxis: {
        categories: [],
        crosshair: true,
        labels: {
            formatter: function () {
                // Formato para mostrar solo la fecha y la hora sin segundos
                var date = new Date(this.value);
                return Highcharts.dateFormat('%Y-%m-%d %H:%M', date); // Año-Mes-Día Hora:Minuto
            }
        }
    },
    yAxis: {
        title: {
            useHTML: true,
            text: 'CH₄ (ppm)'
        }
    },
    tooltip: {
        shared: true,
        useHTML: true,
        formatter: function () {
            var tooltipText = '';

            this.points.forEach(function (point) {
                tooltipText += '<span style="color:rgba(17,17,17,0.84)">';
                tooltipText += point.series.name + ': <b>';
                tooltipText += '<span style="color:rgba(17,17,17,0.84)">';
                tooltipText += point.y.toFixed(1) + ' ppm</b></span><br>';

                if (point.point.creation_date_full) {
                    var formattedDate = Highcharts.dateFormat(
                        '%d-%m-%Y %H:%M',
                        new Date(point.point.creation_date_full).getTime()
                    );
                    tooltipText += '<span style="color:#455a64;">Fecha: ' + formattedDate + '</span>';
                }
            });
            return tooltipText;
        }
    },
    colors: ['#27AE60'],
    series: []
});

// Obtener datos del gráfico mediante AJAX
function get_chart_data_ch4(dataRange) {
    $.ajax({
        url: window.location.pathname,  // La URL de la vista
        type: 'POST',
        data: {
            'action': 'chart_ch4',  // El tipo de acción que estamos solicitando
            'data_range': dataRange
        },
        dataType: 'json',
    }).done(function (data) {
        if (!data.hasOwnProperty('error')) {
            console.log("Datos recibidos:", data);

            // Ordenar los datos por fecha (por si no están ordenados)
            var sortedData = data.data.sort(function (a, b) {
                return new Date(a.created_at) - new Date(b.created_at);
            });

            // No se limita a 50 aquí, el límite se hace en el servidor
            var chartData = sortedData;
            var created_at = [];
            var chartSeriesData = [];

            chartData.forEach(function (record) {
                created_at.push(record.created_at); // Agregar las fechas
                chartSeriesData.push({
                    y: record.ch4,
                    creation_date_full: record.created_at  // <-- Aquí incluyes la fecha para el tooltip
                });
            });

            // Actualizar el gráfico con los nuevos datos
            chart_ch4.xAxis[0].setCategories(created_at);
            if (chart_ch4.series && chart_ch4.series[0]) {
                chart_ch4.series[0].setData(chartSeriesData);
            } else {
                chart_ch4.addSeries({
                    name: 'Metano (CH₄)',
                    data: chartSeriesData
                });
            }
            chart_ch4.redraw(); // Redibujar el gráfico
        } else {
            alert(data.error);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    });
}

// Ejecutar al cargar la página
$(function () {
    var initialDataRange = $('#data-range-filter').val();
    get_chart_data_ch4(initialDataRange); // Cargar datos iniciales

    // Evento change del select
    $('#data-range-filter').change(function () {
        var selectedRange = $(this).val();
        get_chart_data_ch4(selectedRange); // Cargar datos con el nuevo rango
    });

    // Actualización periódica (opcional, puedes mantenerla o eliminarla)
    // Si la mantienes, asegúrate de que el servidor maneje el rango en la petición inicial.
    setInterval(function () {
        var currentRange = $('#data-range-filter').val(); // Obtener el rango actual
        get_chart_data_ch4(currentRange); // Pasar el rango a la función
    }, 5000);
});
