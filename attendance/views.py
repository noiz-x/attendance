from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import Lecture, Attendance
from .utils import check_geofence

class AttendanceViewSet(viewsets.ViewSet):
    """
    A ViewSet for checking attendance via geolocation.
    Expects: latitude, longitude, lecture_id, and student_id.
    """
    def create(self, request):
        try:
            lat = float(request.data.get('latitude'))
            lon = float(request.data.get('longitude'))
        except (TypeError, ValueError):
            return Response({'error': 'Invalid latitude or longitude'}, status=status.HTTP_400_BAD_REQUEST)
        
        lecture_id = request.data.get('lecture_id')
        student_id = request.data.get('student_id')
        if not lecture_id or not student_id:
            return Response({'error': 'Missing lecture_id or student_id'}, status=status.HTTP_400_BAD_REQUEST)

        lecture = get_object_or_404(Lecture, pk=lecture_id)
        
        # Get the building polygon using Theatre.polygon()
        lecture_polygon = lecture.theatre.polygon()
        if not lecture_polygon:
            return Response({'error': 'No building polygon found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check the geofence using the theatre object.
        confirmed, percentage, distance = check_geofence(lat, lon, lecture.theatre)

        student = get_object_or_404(User, pk=student_id)

        Attendance.objects.create(
            student=student,
            lecture=lecture
        )

        return Response({
            'status': 'success' if confirmed else 'failed',
            'message': 'Attendance confirmed.' if confirmed else 'Location is outside the theatre geofence.',
        }, status=status.HTTP_200_OK)
