# Backend/attendance/utils.py

import overpy
import logging
from django.core.cache import cache
from django.contrib.gis.geos import Point, Polygon

logger = logging.getLogger(__name__)

def get_nearest_building_polygon(point, search_radius=50):
    """
    Query the Overpass API for a building polygon near a given point.

    Given a GEOS Point (with x=lon, y=lat), this function searches for building
    ways within a specified search radius (default 50 meters). The resulting polygon
    (list of [lon, lat] pairs) is cached for one hour to reduce external API calls.

    Args:
        point (django.contrib.gis.geos.Point): The point around which to search.
        search_radius (int): Radius in meters for searching the building.

    Returns:
        list or None: A list of coordinate pairs forming a closed polygon, or None if not found.
    """
    cache_key = f"building_polygon_{point.x}_{point.y}_{search_radius}"
    coords = cache.get(cache_key)
    if coords:
        return coords

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
        logger.error("Error querying Overpass API", exc_info=e)
        return None

    for way in result.ways:
        if way.nodes:
            coords = [[float(node.lon), float(node.lat)] for node in way.nodes]
            # Ensure the polygon ring is closed
            if coords and coords[0] != coords[-1]:
                coords.append(coords[0])
            cache.set(cache_key, coords, timeout=3600)  # Cache for 1 hour
            return coords
    return None

def check_geofence(lat, lon, theatre, error_margin_meters=50):
    """
    Check if a given location is within the geofenced area of a theatre.

    This function retrieves the building polygon from the theatre instance,
    buffers it to account for GPS error (converted from meters to degrees), and
    then determines if the user point (constructed from lat, lon) is inside.

    Args:
        lat (float): Latitude of the user's location.
        lon (float): Longitude of the user's location.
        theatre (Theatre): Theatre instance containing the building polygon method.
        error_margin_meters (int): Margin of error in meters for buffering the polygon.

    Returns:
        bool: True if the user's location is within the buffered geofence, else False.

    Raises:
        ValueError: If no building polygon is found.
    """
    user_point = Point(lon, lat, srid=4326)
    poly_coords = theatre.polygon()
    if not poly_coords:
        raise ValueError("Building polygon not found for geofence check.")
    poly = Polygon(poly_coords, srid=4326)
    # Convert error margin from meters to degrees (approximation)
    error_margin_deg = error_margin_meters / 111320.0
    buffered_poly = poly.buffer(error_margin_deg)
    confirmed = buffered_poly.contains(user_point)
    return confirmed
