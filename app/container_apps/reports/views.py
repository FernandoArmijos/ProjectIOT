from datetime import datetime
from django.utils import timezone
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
import pytz

# Create your views here.
class ReportsView(TemplateView):
    template_name = 'reports/reports.html'

    @method_decorator(csrf_exempt)
    @method_decorator(login_required())
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        action = request.POST.get('action', '')

        # Verifica la acción para filtrar datos
        if action == 'report_general':
            start_date_str = request.POST.get('start_date', None)
            end_date_str = request.POST.get('end_date', None)

            # Validación de fechas
            if start_date_str and end_date_str:
                # Define la zona horaria local (Ecuador)
                local_tz = pytz.timezone('America/Guayaquil')

                # Convertir string a datetime naive
                start_naive = datetime.strptime(start_date_str, '%Y-%m-%d %H:%M')
                end_naive = datetime.strptime(end_date_str, '%Y-%m-%d %H:%M')

                # Hacer los datetime "aware" con la zona local
                start_date = local_tz.localize(start_naive)
                end_date = local_tz.localize(end_naive)

                # Convertir a UTC para que coincidan con los registros de la base de datos
                start_date_utc = start_date.astimezone(pytz.utc)
                end_date_utc = end_date.astimezone(pytz.utc)

                with connection.cursor() as cursor:
                    cursor.execute(f"""
                        SELECT created_at, inner_temp, inner_hum, outer_temp, outer_hum, soil_hum, co2, ch4, n2o
                        FROM "iot-node-data"
                        WHERE created_at BETWEEN %s AND %s
                        ORDER BY created_at ASC
                    """, [start_date_utc, end_date_utc])
                    rows = cursor.fetchall()

                columns = ['created_at', 'inner_temp', 'inner_hum', 'outer_temp', 'outer_hum', 'soil_hum', 'co2',
                           'ch4', 'n2o']
                data = [dict(zip(columns, row)) for row in rows]

                return JsonResponse(data, safe=False)

        return JsonResponse({'error': 'Invalid action'}, status=400)
