from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView


# Create your views here.
class IndexView(TemplateView):
    template_name = 'general_app/index.html'

    @method_decorator(csrf_exempt)
    @method_decorator(login_required())
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def fetch_data(self, fields):
        """
        Función para obtener datos dinámicamente de la tabla iot-node-data.
        """
        # Construir consulta con los campos necesarios
        field_names = ', '.join(fields)
        query = f"""
            SELECT created_at, {field_names}
            FROM "iot-node-data"
            ORDER BY created_at
        """
        with connection.cursor() as cursor:
            cursor.execute(query)
            rows = cursor.fetchall()

        # Convertir los resultados en un formato adecuado
        return [
            dict(zip(['created_at'] + fields, row))
            for row in rows
        ]

    def post(self, request, *args, **kwargs):
        action = request.POST.get('action', '')

        # Mapeo de acciones a campos
        actions_map = {
            'chart_temperatures': ['inner_temp', 'outer_temp'],
            'chart_humidity': ['inner_hum', 'outer_hum'],
            'chart_soil_hum': ['soil_hum'],
            'chart_co2': ['co2'],
            'chart_ch4': ['ch4'],
            'chart_n2o': ['n2o'],
        }

        if action in actions_map:
            # Obtener los datos según la acción
            fields = actions_map[action]
            data = self.fetch_data(fields)
            return JsonResponse({'data': data})

        return JsonResponse({'error': 'Acción no válida'}, status=400)

    def get_latest_data(request):  # Nuevo metodo para AJAX
        query = """
            SELECT inner_temp, outer_temp, inner_hum, outer_hum, soil_hum, co2, ch4, n2o
            FROM "iot-node-data"
            ORDER BY created_at DESC
            LIMIT 1
        """
        with connection.cursor() as cursor:
            cursor.execute(query)
            row = cursor.fetchone()

        fields = ['inner_temp', 'outer_temp', 'inner_hum', 'outer_hum', 'soil_hum', 'co2', 'ch4', 'n2o']
        if row:
            data = dict(zip(fields, row))
        else:
            data = {field: None for field in fields}  # Importante: no manejar ningún caso de datos

        return JsonResponse(data)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Consulta para obtener la última fila de datos
        query = """
            SELECT inner_temp, outer_temp, inner_hum, outer_hum, soil_hum, co2, ch4, n2o, node_id
            FROM "iot-node-data"
            ORDER BY created_at DESC
            LIMIT 1
        """
        with connection.cursor() as cursor:
            cursor.execute(query)
            row = cursor.fetchone()

        # Campos para mapear los datos
        fields = ['inner_temp', 'outer_temp', 'inner_hum', 'outer_hum', 'soil_hum', 'co2', 'ch4', 'n2o', 'node_id']
        if row:
            for i, field in enumerate(fields):
                context[f'last_{field}'] = row[i]
        else:
            # Si no hay datos, asignar valores nulos
            for field in fields:
                context[f'last_{field}'] = None

        return context

