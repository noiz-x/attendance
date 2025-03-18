import json
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST
from geopy.distance import geodesic
from .utils import is_within_circular_geofence, is_inside_polygon_geofence

# Configuration for geofencing (replace with your actual values)
THEATRE_CENTER = (7.5176823, 4.5150312)  # Theatre center coordinates (lat, lon)
GEOFENCE_RADIUS = 500  # Maximum acceptable radius in meters
ERROR_MARGIN = 150     # Error margin radius in meters where percentage is 100%

# Define a polygon for the theatre area (list of (lon, lat) tuples)
THEATRE_POLYGON = [
    (-74.0060, 40.7127),
    (-74.0050, 40.7127),
    (-74.0050, 40.7137),
    (-74.0060, 40.7137)
]

def index(request):
    return render(request, 'index.html')

@require_POST
def check_attendance_geofence(request):
    """
    Circular geofence check: verifies if the coordinates are within the defined radius of the theatre center.
    Calculates the distance from the center and computes a percentage:
    - 100% if within the error margin (150 m)
    - Decreases linearly from 100% to 0% for distances between 150 m and the geofence radius (750 m)
    - 0% if beyond the geofence radius
    """
    try:
        data = json.loads(request.body)
        lat = data.get('latitude')
        lon = data.get('longitude')
        print("Received coordinates:", lat, lon)
    except (ValueError, KeyError):
        return JsonResponse({'error': 'Invalid data'}, status=400)

    if lat is None or lon is None:
        return JsonResponse({'error': 'Coordinates missing'}, status=400)

    # Calculate the distance from the user's location to the theatre center
    user_location = (lat, lon)
    distance = geodesic(user_location, THEATRE_CENTER).meters

    # Calculate percentage based on the error margin and geofence radius
    if distance <= ERROR_MARGIN:
        percentage = 100
    elif distance < GEOFENCE_RADIUS:
        # Linear decrease from 100% at ERROR_MARGIN to 0% at GEOFENCE_RADIUS
        percentage = 100 * (GEOFENCE_RADIUS - distance) / (GEOFENCE_RADIUS - ERROR_MARGIN)
    else:
        percentage = 0

    # Check if the user is within the circular geofence
    if is_within_circular_geofence(lat, lon, THEATRE_CENTER[0], THEATRE_CENTER[1], GEOFENCE_RADIUS):
        print("Within the geofence")
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

@require_POST
def check_attendance_polygon(request):
    """
    Polygon geofence check: verifies if the coordinates are inside the defined polygon area.
    """
    try:
        data = json.loads(request.body)
        lat = data.get('latitude')
        lon = data.get('longitude')
    except (ValueError, KeyError):
        return JsonResponse({'error': 'Invalid data'}, status=400)

    if lat is None or lon is None:
        return JsonResponse({'error': 'Coordinates missing'}, status=400)

    if is_inside_polygon_geofence(lat, lon, THEATRE_POLYGON):
        return JsonResponse({
            'status': 'success',
            'message': 'Attendance confirmed. Location is inside the theatre polygon.'
        })
    else:
        return JsonResponse({
            'status': 'failed',
            'message': 'Location is outside the theatre polygon.'
        })
