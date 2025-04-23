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
var chart_humidity = Highcharts.chart('container_chart_humidity', {
    chart: {
        height: 400,
        type: 'spline'
    },
    title: {
        text: 'Humedad Interna y Externa',
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
            text: 'Humedad relativa (%)'
        }
    },
    tooltip: {
        shared: true,
        useHTML: true,
        formatter: function () {
            var tooltipText = '';

            var humInterna = this.points.find(p => p.series.name === 'Humedad Interna');
            var humExterna = this.points.find(p => p.series.name === 'Humedad Externa');

            if (humInterna) {
                tooltipText += '<span style="color:#1cb83d;">';
                tooltipText += 'Humedad Interna: <b>' + humInterna.y.toFixed(1) + ' %</b></span><br>';
            }

            if (humExterna) {
                tooltipText += '<span style="color:#605d5d;">';
                tooltipText += 'Humedad Externa: <b>' + humExterna.y.toFixed(1) + ' %</b></span><br>';
            }

            // Agregar fecha (tomada desde uno de los puntos)
            const anyPoint = this.points[0];
            if (anyPoint.point.creation_date_full) {
                var formattedDate = Highcharts.dateFormat(
                    '%d-%m-%Y %H:%M',
                    new Date(anyPoint.point.creation_date_full).getTime()
                );
                tooltipText += 'Fecha: ' + formattedDate;
            }

            return tooltipText;
        }
    },
    colors: ['#1cb83d', '#605d5d'],
    series: []
});

// Obtener datos del gráfico mediante AJAX
function get_chart_data_humidity(dataRange) {
    $.ajax({
        url: window.location.pathname,  // La URL de la vista
        type: 'POST',
        data: {
            'action': 'chart_humidity',  // El tipo de acción que estamos solicitando
            'data_range': dataRange // Enviar el rango al servidor
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

            // Ahora puedes usar los datos para crear el gráfico o mostrarlos en una tabla
            // Para el gráfico, puedes agregar la humedad interna y externa
            var created_at = [];
            var inner_hum_data = [];
            var outer_hum_data = [];

            chartData.forEach(function (record) {
                created_at.push(record.created_at);  // Agregar las fechas
                inner_hum_data.push({
                    y: record.inner_hum,
                    creation_date_full: record.created_at
                });
                outer_hum_data.push({
                    y: record.outer_hum,
                    creation_date_full: record.created_at
                });
            });

            // Actualizar las categorías (fechas) del gráfico
            chart_humidity.xAxis[0].setCategories(created_at);

            // Actualizar la serie de humedad interna
            if (chart_humidity.series && chart_humidity.series[0]) {
                chart_humidity.series[0].setData(inner_hum_data);
            } else {
                chart_humidity.addSeries({
                    name: 'Humedad Interna',
                    data: inner_hum_data
                });
            }

            // Actualizar la serie de humedad externa
            if (chart_humidity.series && chart_humidity.series[1]) {
                chart_humidity.series[1].setData(outer_hum_data);
            } else {
                chart_humidity.addSeries({
                    name: 'Humedad Externa',
                    data: outer_hum_data
                });
            }

            chart_humidity.redraw(); // Redibujar el gráfico
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
    get_chart_data_humidity(initialDataRange); // Cargar datos iniciales

    // Evento change del select
    $('#data-range-filter').change(function () {
        var selectedRange = $(this).val();
        get_chart_data_humidity(selectedRange); // Cargar datos con el nuevo rango
    });

    // Actualización periódica (opcional, puedes mantenerla o eliminarla)
    // Si la mantienes, asegúrate de que el servidor maneje el rango en la petición inicial.
    setInterval(function() {
        var currentRange = $('#data-range-filter').val(); // Obtener el rango actual
        get_chart_data_humidity(currentRange); // Pasar el rango a la función
    }, 5000);
});
