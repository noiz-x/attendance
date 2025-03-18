import json
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST
from geopy.distance import geodesic
from .utils import is_within_circular_geofence
from .models import Theatre

def index(request):
    return render(request, 'index.html')

@require_POST
def check_attendance_geofence(request):
    """
    Circular geofence check: verifies if the coordinates are within the defined radius of the theatre center.
    Calculates the distance from the centre and computes a percentage:
      - 100% if within the error margin (e.g., 150 m)
      - Decreases linearly from 100% to 0% for distances between the error margin and the geofence radius (e.g., 750 m)
      - 0% if beyond the geofence radius.
    """
    try:
        data = json.loads(request.body)
        lat = data.get('latitude')
        lon = data.get('longitude')
    except (ValueError, KeyError):
        return JsonResponse({'error': 'Invalid data'}, status=400)

    if lat is None or lon is None:
        return JsonResponse({'error': 'Coordinates missing'}, status=400)

    # Retrieve theatre configuration (adjust this logic if you have multiple theatres)
    theatre = Theatre.objects.first()
    print(theatre)
    if not theatre:
        return JsonResponse({'error': 'Theatre not found'}, status=404)

    # Calculate distance from user to theatre center
    user_location = (lat, lon)
    theatre_center = (theatre.center_lat, theatre.center_lon)
    distance = geodesic(user_location, theatre_center).meters

    # Calculate percentage based on error margin and geofence radius.
    if distance <= theatre.error_margin:
        percentage = 100
    elif distance < theatre.geofence_radius:
        percentage = 100 * (theatre.geofence_radius - distance) / (theatre.geofence_radius - theatre.error_margin)
    else:
        percentage = 0

    confirmed = distance <= theatre.geofence_radius

    # Optional: Use is_within_circular_geofence to double-check.
    if is_within_circular_geofence(lat, lon, theatre.center_lat, theatre.center_lon, theatre.geofence_radius):
        return JsonResponse({
            'status': 'success',
            'message': 'Attendance confirmed. Location is within the theatre geofence.',
            'distance': distance,
            'percentage': percentage,
        })
    else:
        return JsonResponse({
            'status': 'failed',
            'message': 'Location is outside the theatre geofence.',
            'distance': distance,
            'percentage': percentage,
        })
