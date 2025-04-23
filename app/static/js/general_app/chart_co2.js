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
var chart_co2 = Highcharts.chart('container_chart_co2', {
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
        text: 'CO₂',
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
            text: 'CO₂ (ppm)'
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
    colors: ['#a63259'],
    series: []
});

// Obtener datos del gráfico mediante AJAX
function get_chart_data_co2(dataRange) {
    $.ajax({
        url: window.location.pathname,  // La URL de la vista
        type: 'POST',
        data: {
            'action': 'chart_co2',  // El tipo de acción que estamos solicitando
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
            var chartSeriesData = [];

            chartData.forEach(function (record) {
                created_at.push(record.created_at);  // Agregar las fechas
                chartSeriesData.push({
                    y: record.co2,
                    creation_date_full: record.created_at  // <-- Aquí incluyes la fecha para el tooltip
                });
            });

            // Actualizar el gráfico con los nuevos datos
            chart_co2.xAxis[0].setCategories(created_at);
            if (chart_co2.series && chart_co2.series[0]) {
                chart_co2.series[0].setData(chartSeriesData);
            } else {
                chart_co2.addSeries({
                    name: 'Dióxido de Carbono (C0₂)',
                    data: chartSeriesData
                });
            }
            chart_co2.redraw(); // Redibujar el gráfico
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
    get_chart_data_co2(initialDataRange); // Cargar datos iniciales

    // Evento change del select
    $('#data-range-filter').change(function () {
        var selectedRange = $(this).val();
        get_chart_data_co2(selectedRange); // Cargar datos con el nuevo rango
    });

    // Actualización periódica (opcional, puedes mantenerla o eliminarla)
    // Si la mantienes, asegúrate de que el servidor maneje el rango en la petición inicial.
    setInterval(function () {
        var currentRange = $('#data-range-filter').val(); // Obtener el rango actual
        get_chart_data_co2(currentRange); // Pasar el rango a la función
    }, 5000);
});
