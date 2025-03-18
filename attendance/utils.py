from geopy.distance import geodesic
from shapely.geometry import Point, Polygon

def is_within_circular_geofence(lat, lon, center_lat, center_lon, radius_meters):
    """
    Check if the given coordinates (lat, lon) are within the specified circular geofence.
    """
    distance = geodesic((lat, lon), (center_lat, center_lon)).meters
    return distance <= radius_meters

def is_inside_polygon_geofence(lat, lon, polygon_coords):
    """
    Check if the given coordinates (lat, lon) are within the polygon.
    polygon_coords should be a list of (lon, lat) tuples.
    """
    point = Point(lon, lat)  # Note: Shapely expects (x, y) => (lon, lat)
    polygon = Polygon(polygon_coords)
    return polygon.contains(point)
