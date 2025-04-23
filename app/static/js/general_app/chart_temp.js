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
var chart_temperatures = Highcharts.chart('container_chart_temperatures', {
    chart: {
        height: 400,
        type: 'spline'
    },
    title: {
        text: 'Temperaturas Internas y Externas',
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
            text: 'Temperatura (°C)'
        }
    },
    tooltip: {
        shared: true,
        useHTML: true,
        formatter: function () {
            var tooltipText = '';

            var tempInterna = this.points.find(p => p.series.name === 'Temperatura Interna');
            var tempExterna = this.points.find(p => p.series.name === 'Temperatura Externa');

            if (tempInterna) {
                tooltipText += '<span style="color:#0d6efd;">';
                tooltipText += 'Temperatura Interna: <b>' + tempInterna.y.toFixed(1) + ' °C</b></span><br>';
            }

            if (tempExterna) {
                tooltipText += '<span style="color:#dc3545;">';
                tooltipText += 'Temperatura Externa: <b>' + tempExterna.y.toFixed(1) + ' °C</b></span><br>';
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
    exporting: {
        enabled: true,
        fallbackToExportServer: true, // Intenta el servidor si falla el cliente
        menuItems: [
            'viewFullscreen',
            'printChart',
            'downloadPDF',
            'downloadCSV',
            'downloadXLS',
            'viewData'
        ]
    },
    colors: ['#007bff', '#dc3545'],
    series: []
});

// Obtener datos del gráfico mediante AJAX
function get_chart_data_temperatures(dataRange) {
    $.ajax({
        url: window.location.pathname,  // La URL de la vista
        type: 'POST',
        data: {
            'action': 'chart_temperatures',  // El tipo de acción que estamos solicitando
            'data_range': dataRange // Enviar el rango al servidor
        },
        dataType: 'json',
    }).done(function (data) {
        if (!data.hasOwnProperty('error')) {
            console.log("Datos recibidos:", data);

            // Ordenar los datos por fecha (ahora depende del rango)
            var sortedData = data.data.sort(function (a, b) {
                return new Date(a.created_at) - new Date(b.created_at);
            });

            // No se limita a 50 aquí, el límite se hace en el servidor
            var chartData = sortedData;

            console.log(chartData);

            // Ahora puedes usar los datos para crear el gráfico o mostrarlos en una tabla
            // Para el gráfico, puedes agregar la temperatura interna y externa
            var created_at = [];
            var inner_temp_data = [];
            var outer_temp_data = [];

            chartData.forEach(function (record) {
                created_at.push(record.created_at);  // Agregar las fechas
                inner_temp_data.push({
                    y: record.inner_temp,
                    creation_date_full: record.created_at
                });
                outer_temp_data.push({
                    y: record.outer_temp,
                    creation_date_full: record.created_at
                });
            });

            // Actualizar el gráfico con los nuevos datos
            chart_temperatures.xAxis[0].setCategories(created_at);

            if (chart_temperatures.series && chart_temperatures.series[0]) {
                chart_temperatures.series[0].setData(inner_temp_data);
            } else {
                chart_temperatures.addSeries({
                    name: 'Temperatura Interna',
                    data: inner_temp_data
                });
            }

            // Actualizar la serie de humedad externa
            if (chart_temperatures.series && chart_temperatures.series[1]) {
                chart_temperatures.series[1].setData(outer_temp_data);
            } else {
                chart_temperatures.addSeries({
                    name: 'Temperatura Externa',
                    data: outer_temp_data
                });
            }
            chart_temperatures.redraw();
        } else {
            alert(data.error);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    });
}

// Ejecutar al cargar la página
$(function () {
    // Obtener el valor inicial del select
    var initialDataRange = $('#data-range-filter').val();
    get_chart_data_temperatures(initialDataRange); // Cargar datos iniciales

    // Evento change del select
    $('#data-range-filter').change(function () {
        var selectedRange = $(this).val();
        get_chart_data_temperatures(selectedRange); // Cargar datos con el nuevo rango
    });

    // Actualización periódica (opcional, puedes mantenerla o eliminarla)
    // Si la mantienes, asegúrate de que el servidor maneje el rango en la petición inicial.
    setInterval(function () {
        var currentRange = $('#data-range-filter').val(); // Obtener el rango actual
        get_chart_data_temperatures(currentRange); // Pasar el rango a la función
    }, 5000);
});
