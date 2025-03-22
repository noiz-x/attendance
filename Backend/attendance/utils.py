# Backend/attendance/utils.py

import overpy
from django.contrib.gis.geos import Point, Polygon

def get_nearest_building_polygon(point, search_radius=50):
    """
    Given a GEOS Point (x=lon, y=lat), queries the Overpass API (via python-overpy)
    for building ways within `search_radius` meters and returns the polygon coordinates 
    (list of [lon, lat] pairs) for the first building found.
    """
    lon, lat = point.x, point.y
    api = overpy.Overpass()
    query = f"""
      way(around:{search_radius},{lat},{lon})["building"];
      (._;>;);
      out body;
    """
    try:
        result = api.query(query)
    except Exception as e:
        # Log error as needed.
        return None

    for way in result.ways:
        if way.nodes:
            coords = [[float(node.lon), float(node.lat)] for node in way.nodes]
            # Ensure the polygon ring is closed.
            if coords and coords[0] != coords[-1]:
                coords.append(coords[0])
            return coords
    return None

def calculate_attendance_percentage(distance, error_margin, geofence_radius):
    if distance <= error_margin:
        return 100
    elif distance < geofence_radius:
        return 100 * (geofence_radius - distance) / (geofence_radius - error_margin)
    return 0

def check_geofence(lat, lon, theatre, error_margin_meters=50):
    """
    Check if the user's coordinates (lat, lon) are within the theatre's geofence,
    taking into account a margin for GPS error.

    This function retrieves the building polygon from theatre.polygon() (which should return a list of [lon, lat] pairs),
    converts it into a GEOS Polygon, then buffers it by an approximate error margin (converted from meters to degrees),
    and finally checks whether the user's point falls within the buffered polygon.

    Returns:
      confirmed (bool): True if the (buffered) polygon contains the point.
      percentage (int): 100 if confirmed, else 0 (can be extended to compute a scaled percentage).
      distance (None): (Optional) placeholder for distance calculations.
    """
    user_point = Point(lon, lat, srid=4326)
    poly_coords = theatre.polygon()
    if not poly_coords:
        return False, 0, None
    # Create the GEOS Polygon from the coordinates
    poly = Polygon(poly_coords, srid=4326)
    # Convert error margin from meters to degrees (approximate; 1 degree ≈ 111320 meters)
    error_margin_deg = error_margin_meters / 111320.0
    # Buffer the polygon to "enlarge" it, accommodating GPS inaccuracies
    buffered_poly = poly.buffer(error_margin_deg)
    confirmed = buffered_poly.contains(user_point)
    return confirmed
