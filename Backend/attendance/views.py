# Backend/attendance/views.py

import logging
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction, IntegrityError
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils import timezone
from .models import Course, Lecture, Registration, Attendance
from .serializers import (
    CourseSerializer,
    LectureSerializer,
    CourseRegistrationSerializer,
    AttendanceSerializer,
)
from .utils import check_geofence

logger = logging.getLogger(__name__)

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for listing courses.

    Provides a read-only endpoint to:
      - Retrieve a list of all available courses.
      - Include nested lecture details for each course.

    The endpoint ensures:
      - Only authenticated users can access the data.
    """
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

class LectureViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for listing lectures.

    Provides a read-only endpoint to:
      - Retrieve a list of all available lectures.
      - Include details about each lecture.

    The endpoint ensures:
      - Only authenticated users can access the data.
    """
    queryset = Lecture.objects.all()
    serializer_class = LectureSerializer
    permission_classes = [permissions.IsAuthenticated]

class RegistrationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for course registration.

    Allows students to register for courses. Only displays registrations
    for the authenticated student.

    The endpoint performs the following actions:
      - Retrieves registrations for the authenticated student.
      - Allows the creation of new registrations for the authenticated student.
    """
    serializer_class = CourseRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Registration.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

class AttendanceViewSet(viewsets.ViewSet):
    """
    API endpoint for recording attendance via geolocation.

    Expects the following POST parameters:
      - latitude: The user's latitude.
      - longitude: The user's longitude.
      - lecture_id: The ID of the lecture for which attendance is being recorded.

    The endpoint checks:
      - That the lecture occurrence is not canceled.
      - The user's location is within the theatre's geofence.
      - Concurrency is handled to prevent duplicate attendance records.
    """
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request):
        try:
            lat = float(request.data.get("latitude"))
            lon = float(request.data.get("longitude"))
        except (TypeError, ValueError) as e:
            logger.warning("Invalid latitude or longitude provided.", exc_info=e)
            return Response(
                {"error": "Invalid latitude or longitude"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        lecture_id = request.data.get("lecture_id")
        if not lecture_id:
            return Response(
                {"error": "Missing lecture id"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        lecture = get_object_or_404(Lecture, id=lecture_id)
        
        # Determine occurrence_date; defaulting to today's local date.
        occurrence_date = timezone.localdate()

        # Check if the lecture occurrence has been canceled.
        if lecture.canceled_occurrences.filter(occurrence_date=occurrence_date).exists():
            return Response(
                {"error": "This lecture occurrence has been canceled."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        polygon = lecture.theatre.polygon()
        if not polygon:
            return Response(
                {"error": "No building polygon found for the theatre."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            confirmed = check_geofence(lat, lon, lecture.theatre)
        except Exception as e:
            logger.error("Error during geofence check.", exc_info=e)
            return Response(
                {"error": "An error occurred while processing your location."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with transaction.atomic():
                attendance, created = Attendance.objects.get_or_create(
                    student=request.user,
                    lecture=lecture,
                    occurrence_date=occurrence_date,
                    defaults={'attended': confirmed}
                )
                if not created:
                    return Response(
                        {"error": "Attendance already recorded for this lecture occurrence."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
        except IntegrityError as e:
            logger.error("IntegrityError during attendance creation.", exc_info=e)
            return Response(
                {"error": "A concurrency error occurred. Please try again."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "status": "success" if confirmed else "failed",
                "attended": confirmed,
                "message": "Attendance confirmed." if confirmed else "Location is outside the theatre geofence.",
            },
            status=status.HTTP_200_OK,
        )
