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
var chart_humidity_soil = Highcharts.chart('container_chart_humidity_soil', {
    chart: {
        height: 400,
        type: 'area',
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
        text: 'Humedad del suelo',
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
            text: 'Humedad del suelo (%)'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}°C</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
        // Formato para el tooltip, para mostrar solo la fecha y la hora sin segundos
        formatter: function () {
            var date = new Date(this.x);  // Usar la propiedad `x` que es la fecha
            var formattedDate = Highcharts.dateFormat('%Y-%m-%d %H:%M', date); // Año-Mes-Día Hora:Minuto
            return '<b>' + formattedDate + '</b><br>' + this.points.map(function (point) {
                return point.series.name + ': ' + point.y.toFixed(1) + '%';
            }).join('<br>');
        }
    },
    colors: ['#479393'],
    series: []
});

// Obtener datos del gráfico mediante AJAX
function get_chart_data_humidity_soil(dataRange) {
    $.ajax({
        url: window.location.pathname,  // La URL de la vista
        type: 'POST',
        data: {
            'action': 'chart_soil_hum',  // El tipo de acción que estamos solicitando
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
            var soil_hum = [];

            chartData.forEach(function (record) {
                created_at.push(record.created_at);  // Agregar las fechas
                soil_hum.push(record.soil_hum);  // Agregar la humedad del suelo
            });

            // Actualizar el gráfico con los nuevos datos
            chart_humidity_soil.xAxis[0].setCategories(created_at);
            if (chart_humidity_soil.series && chart_humidity_soil.series[0]) {
                chart_humidity_soil.series[0].setData(soil_hum);
            } else {
                chart_humidity_soil.addSeries({
                    name: 'Humedad del suelo',
                    data: soil_hum
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
    get_chart_data_humidity_soil(initialDataRange); // Cargar datos iniciales

    // Evento change del select
    $('#data-range-filter').change(function () {
        var selectedRange = $(this).val();
        get_chart_data_humidity_soil(selectedRange); // Cargar datos con el nuevo rango
    });

    // Actualización periódica (opcional, puedes mantenerla o eliminarla)
    // Si la mantienes, asegúrate de que el servidor maneje el rango en la petición inicial.
    setInterval(function() {
        var currentRange = $('#data-range-filter').val(); // Obtener el rango actual
        get_chart_data_humidity_soil(currentRange); // Pasar el rango a la función
    }, 5000);
});
