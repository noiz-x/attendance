# Backend/attendance/views.py

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Lecture, Attendance
from .utils import check_geofence

class AttendanceViewSet(viewsets.ViewSet):
    """
    A ViewSet for checking attendance via geolocation.
    Expects: latitude, longitude, lecture_id.
    User must be authenticated with a valid JWT.
    """
    permission_classes = [IsAuthenticated]

    def create(self, request):
        try:
            lat = float(request.data.get('latitude'))
            lon = float(request.data.get('longitude'))
        except (TypeError, ValueError):
            return Response({'error': 'Invalid latitude or longitude'}, status=status.HTTP_400_BAD_REQUEST)
        
        lecture_id = request.data.get('lecture_id')
        if not lecture_id:
            return Response({'error': 'Missing lecture_id'}, status=status.HTTP_400_BAD_REQUEST)

        lecture = get_object_or_404(Lecture, pk=lecture_id)
        lecture_polygon = lecture.theatre.polygon()
        if not lecture_polygon:
            return Response({'error': 'No building polygon found'}, status=status.HTTP_404_NOT_FOUND)
        
        confirmed, percentage, distance = check_geofence(lat, lon, lecture.theatre)
        # Use the authenticated user
        Attendance.objects.create(
            student=request.user,
            lecture=lecture
        )

        return Response({
            'status': 'success' if confirmed else 'failed',
            'message': 'Attendance confirmed.' if confirmed else 'Location is outside the theatre geofence.',
            'percentage': percentage if percentage is not None else 'N/A',
            'distance': distance if distance is not None else 'N/A'
        }, status=status.HTTP_200_OK)
