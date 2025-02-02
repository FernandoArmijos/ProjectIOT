from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView


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
            start_date = request.POST.get('start_date', None)
            end_date = request.POST.get('end_date', None)

            # Validación de fechas
            if start_date and end_date:
                with connection.cursor() as cursor:
                    cursor.execute(f"""
                        SELECT created_at, inner_temp, inner_hum, outer_temp, outer_hum, soil_hum, co2, ch4, n2o
                        FROM "iot-node-data"
                        WHERE created_at BETWEEN %s AND %s
                        ORDER BY created_at ASC
                    """, [start_date, end_date])
                    rows = cursor.fetchall()

                columns = ['created_at', 'inner_temp', 'inner_hum', 'outer_temp', 'outer_hum', 'soil_hum', 'co2',
                           'ch4', 'n2o']
                data = [dict(zip(columns, row)) for row in rows]

                return JsonResponse(data, safe=False)

        return JsonResponse({'error': 'Invalid action'}, status=400)
