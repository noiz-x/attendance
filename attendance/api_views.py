# attendance/api_views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from geopy.distance import geodesic
from .models import Theatre, Lecture, Attendance
from django.contrib.auth.models import User

class CheckAttendance(APIView):
    """
    API endpoint to check attendance based on geolocation.
    Expects latitude, longitude, lecture_id, and student_id.
    """
    def post(self, request, format=None):
        try:
            lat = float(request.data.get('latitude'))
            lon = float(request.data.get('longitude'))
            lecture_id = request.data.get('lecture_id')
            student_id = request.data.get('student_id')
        except Exception as e:
            return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

        if not all([lat, lon, lecture_id, student_id]):
            return Response({'error': 'Missing data'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lecture = Lecture.objects.get(pk=lecture_id)
            theatre = lecture.theatre
        except Lecture.DoesNotExist:
            return Response({'error': 'Lecture not found'}, status=status.HTTP_404_NOT_FOUND)

        # Calculate the distance from the user's location to the theatre center
        user_location = (lat, lon)
        theatre_center = (theatre.center_lat, theatre.center_lon)
        distance = geodesic(user_location, theatre_center).meters

        # Compute the percentage:
        # 100% if within error_margin; decreases linearly to 0% at geofence_radius.
        if distance <= theatre.error_margin:
            percentage = 100
        elif distance < theatre.geofence_radius:
            percentage = 100 * (theatre.geofence_radius - distance) / (theatre.geofence_radius - theatre.error_margin)
        else:
            percentage = 0

        confirmed = distance <= theatre.geofence_radius

        # Create an attendance record
        try:
            student = User.objects.get(pk=student_id)
        except User.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

        Attendance.objects.create(
            student=student,
            lecture=lecture,
            distance=distance,
            percentage=percentage,
            confirmed=confirmed
        )

        return Response({
            'status': 'success' if confirmed else 'failed',
            'message': 'Attendance confirmed.' if confirmed else 'Location is outside the theatre geofence.',
            'distance': distance,
            'percentage': percentage,
        }, status=status.HTTP_200_OK)
