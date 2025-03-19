# attendance/views.py
import json
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST
from .models import Theatre
from .utils import check_geofence

def index(request):
    """
    Renders the main page with the real-time attendance check interface.
    """
    return render(request, 'index.html')

@require_POST
def check_attendance_geofence(request):
    """
    Verifies if the provided coordinates are within the theatre geofence.
    Returns a JSON response with the attendance percentage and distance.
    """
    try:
        data = json.loads(request.body)
        lat = float(data.get('latitude'))
        lon = float(data.get('longitude'))
    except (ValueError, TypeError):
        return JsonResponse({'error': 'Invalid data'}, status=400)

    if lat is None or lon is None:
        return JsonResponse({'error': 'Coordinates missing'}, status=400)

    theatre = Theatre.objects.first()
    if not theatre:
        return JsonResponse({'error': 'Theatre not found'}, status=404)

    confirmed, percentage, distance = check_geofence(lat, lon, theatre)
    response = {
        'status': 'success' if confirmed else 'failed',
        'message': 'Attendance confirmed. Location is within the theatre geofence.' if confirmed else 'Location is outside the theatre geofence.',
        'distance': distance,
        'percentage': percentage,
    }
    return JsonResponse(response)
