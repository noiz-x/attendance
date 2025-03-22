from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction, IntegrityError
from django.core.exceptions import ValidationError as DjangoValidationError
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
            return Response({'error': 'Missing lecture id'}, status=status.HTTP_400_BAD_REQUEST)

        lecture = get_object_or_404(Lecture, id=lecture_id)
        lecture_polygon = lecture.theatre.polygon()
        if not lecture_polygon:
            return Response({'error': 'No building polygon found'}, status=status.HTTP_404_NOT_FOUND)
        
        confirmed = check_geofence(lat, lon, lecture.theatre)
        
        try:
            with transaction.atomic():
                Attendance.objects.create(
                    student=request.user,
                    lecture=lecture
                )
        except IntegrityError:
            return Response({'error': 'Attendance already recorded or a concurrency error occurred.'}, status=status.HTTP_400_BAD_REQUEST)
        except DjangoValidationError as e:
            # e.messages returns a list of error messages.
            return Response(
                {'error': e.messages},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response({
            'status': 'success' if confirmed else 'failed',
            'message': 'Attendance confirmed.' if confirmed else 'Location is outside the theatre geofence.',
        }, status=status.HTTP_200_OK)
