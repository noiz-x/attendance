import overpy
from django.contrib.gis.geos import Point, Polygon

def get_nearest_building_polygon(point, search_radius=10):
    """
    Given a GEOS Point (x=lon, y=lat), queries the Overpass API (via python-overpy)
    for building ways within `search_radius` meters and returns the polygon coordinates 
    (list of [lon, lat] pairs) for the first building found.
    """
    lon, lat = point.x, point.y
    print(lon, lat)
    api = overpy.Overpass()
    query = f"""
      way(around:{search_radius},{lat},{lon})["building"];
      (._;>;);
      out body;
    """
    try:
        result = api.query(query)
    except Exception as e:
        # Log the error if needed
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

def check_geofence(lat, lon, theatre):
    """
    Check if the user's coordinates (lat, lon) are within the theatre's geofence.
    Expects theatre.polygon() to return a list of [lon, lat] pairs.
    """
    user_point = Point(lon, lat, srid=4326)
    poly_coords = theatre.polygon()
    if not poly_coords:
        return False, 0, None
    # Create a GEOS Polygon from the list of coordinates.
    poly = Polygon(poly_coords, srid=4326)
    confirmed = poly.contains(user_point)
    percentage = 100 if confirmed else 0
    return confirmed, percentage, None
