# attendance/utils.py
from shapely.geometry import Point, Polygon
from geopy.distance import geodesic

def is_within_circular_geofence(lat, lon, center_lat, center_lon, radius_meters):
    """
    Check if the given coordinates (lat, lon) are within a circular geofence.
    Returns a tuple (confirmed, distance).
    """
    distance = geodesic((lat, lon), (center_lat, center_lon)).meters
    return distance <= radius_meters, distance

def is_inside_polygon_geofence(lat, lon, polygon_coords):
    """
    Check if the given coordinates (lat, lon) are inside the polygon defined by polygon_coords.
    Expects polygon_coords as a list of [lon, lat] pairs.
    """
    point = Point(lon, lat)  # Shapely expects (x, y) = (lon, lat)
    polygon = Polygon(polygon_coords)
    return polygon.contains(point)

def calculate_attendance_percentage(distance, error_margin, geofence_radius):
    """
    Calculates the attendance percentage based on distance.
    Returns 100 if within error_margin, linearly decreases to 0 at geofence_radius.
    """
    if distance <= error_margin:
        return 100
    elif distance < geofence_radius:
        return 100 * (geofence_radius - distance) / (geofence_radius - error_margin)
    return 0

def check_geofence(lat, lon, theatre):
    """
    Checks the geofence for a given theatre.
    Uses polygon geofencing if theatre.polygon_coordinates is provided; otherwise uses circular geofencing.
    Returns a tuple (confirmed, percentage, distance).
    For polygon, distance is None.
    """
    print(theatre.polygon_coordinates)
    if theatre.polygon_coordinates:
        confirmed = is_inside_polygon_geofence(lat, lon, theatre.polygon_coordinates)
        percentage = 100 if confirmed else 0
        return confirmed, percentage, 0
    else:
        confirmed, distance = is_within_circular_geofence(lat, lon, theatre.center_lat, theatre.center_lon, theatre.geofence_radius)
        percentage = calculate_attendance_percentage(distance, theatre.error_margin, theatre.geofence_radius)
        return confirmed, percentage, distance
