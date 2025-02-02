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
    colors: ['#80501b'],
    series: []
});

// Obtener datos del gráfico mediante AJAX
function get_chart_data_ch4() {
    $.ajax({
        url: window.location.pathname,  // La URL de la vista
        type: 'POST',
        data: {
            'action': 'chart_ch4'  // El tipo de acción que estamos solicitando
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
            var created_at = [];
            var ch4 = [];

            last50Data.forEach(function (record) {
                created_at.push(record.created_at);  // Agregar las fechas
                ch4.push(record.ch4);
            });

            // Actualizar el gráfico con los nuevos datos
            chart_ch4.xAxis[0].setCategories(created_at);
            if (chart_ch4.series[0]) {
                chart_ch4.series[0].setData(ch4);
            } else {
                chart_ch4.addSeries({
                    name: 'Metano (CH₄)',
                    data: ch4
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
    get_chart_data_ch4();
    // Actualizar el gráfico cada 5 segundos (5000 ms)
    setInterval(get_chart_data_ch4, 5000);
});
