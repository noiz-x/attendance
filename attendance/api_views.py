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
        theatre = lecture.theatre

        confirmed, percentage, distance = check_geofence(lat, lon, theatre)
        student = get_object_or_404(User, pk=student_id)

        Attendance.objects.create(
            student=student,
            lecture=lecture,
            distance=distance if distance is not None else 0,
            percentage=percentage,
            confirmed=confirmed
        )

        return Response({
            'status': 'success' if confirmed else 'failed',
            'message': 'Attendance confirmed.' if confirmed else 'Location is outside the theatre geofence.',
            'distance': distance,
            'percentage': percentage,
        }, status=status.HTTP_200_OK)
