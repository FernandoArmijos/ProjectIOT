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
function get_chart_data_humidity_soil() {
    $.ajax({
        url: window.location.pathname,  // La URL de la vista
        type: 'POST',
        data: {
            'action': 'chart_soil_hum'  // El tipo de acción que estamos solicitando
        },
        dataType: 'json',
    }).done(function (data) {
        if (!data.hasOwnProperty('error')) {
            console.log("Datos recibidos:", data);

            // Ordenar los datos por fecha (por si no están ordenados)
            var sortedData = data.data.sort(function (a, b) {
                return new Date(a.created_at) - new Date(b.created_at);
            });

            // Obtener los últimos 50 registros
            var last50Data = sortedData.slice(-50); // Los últimos 50 elementos

            console.log("Últimos 50 datos:", last50Data);
            // Ahora puedes usar los datos para crear el gráfico o mostrarlos en una tabla
            // Para el gráfico, puedes agregar la humedad interna y externa
            var created_at = [];
            var soil_hum = [];

            last50Data.forEach(function (record) {
                created_at.push(record.created_at);  // Agregar las fechas
                soil_hum.push(record.soil_hum);  // Agregar la humedad del suelo
            });

            // Actualizar el gráfico con los nuevos datos
            chart_humidity_soil.xAxis[0].setCategories(created_at);
            if (chart_humidity_soil.series[0]) {
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
    get_chart_data_humidity_soil();
    // Actualizar el gráfico cada 5 segundos (5000 ms)
    setInterval(get_chart_data_humidity_soil, 5000);
});
