from django.contrib.gis.geos import Point
from geopy.distance import geodesic

def calculate_attendance_percentage(distance, error_margin, geofence_radius):
    if distance <= error_margin:
        return 100
    elif distance < geofence_radius:
        return 100 * (geofence_radius - distance) / (geofence_radius - error_margin)
    return 0

def check_geofence(lat, lon, theatre):
    # Create a Point from the given coordinates (GeoDjango expects Point(lon, lat))
    user_point = Point(lon, lat, srid=4326)
    if theatre.geofence:
        confirmed = theatre.geofence.contains(user_point)
        percentage = 100 if confirmed else 0
        return confirmed, percentage, None
    else:
        theatre_center = (theatre.center.y, theatre.center.x)  # (lat, lon)
        user_coords = (lat, lon)
        distance = geodesic(user_coords, theatre_center).meters
        percentage = calculate_attendance_percentage(distance, theatre.error_margin, theatre.geofence_radius)
        confirmed = distance <= theatre.geofence_radius
        return confirmed, percentage, distance
