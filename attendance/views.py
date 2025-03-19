from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, Http404
from .models import Theatre

def index(request):
    return render(request, 'index.html')

def fetch_nearest_building_polygon(request, theatre_id):
    theatre = get_object_or_404(Theatre, pk=theatre_id)
    # Use the Theatre method polygon() to get the building polygon.
    polygon = theatre.polygon()
    if polygon:
        return JsonResponse({'polygon': polygon})
    else:
        return JsonResponse({'error': 'No building polygon found'}, status=404)
