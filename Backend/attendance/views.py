# Backend/attendance/views.py

from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction, IntegrityError
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils import timezone
from .models import Course, Lecture, Registration, Attendance, CanceledOccurrence
from .serializers import (
    CourseSerializer,
    LectureSerializer,
    CourseRegistrationSerializer,
    AttendanceSerializer,
)
from .utils import check_geofence

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only endpoint to list courses along with their nested lectures.
    """
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

class LectureViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only endpoint to list lectures.
    """
    queryset = Lecture.objects.all()
    serializer_class = LectureSerializer
    permission_classes = [permissions.IsAuthenticated]

class RegistrationViewSet(viewsets.ModelViewSet):
    """
    Endpoint for course registration.
    Allows students to register for courses.
    Only displays registrations for the authenticated student.
    """
    serializer_class = CourseRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Registration.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

class AttendanceViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request):
        try:
            lat = float(request.data.get("latitude"))
            lon = float(request.data.get("longitude"))
        except (TypeError, ValueError):
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
        
        # Set the occurrence_date; here defaulting to today's date.
        occurrence_date = timezone.localdate()

        # Check if the lecture occurrence is canceled.
        if lecture.canceled_occurrences.filter(occurrence_date=occurrence_date).exists():
            return Response(
                {"error": "This lecture occurrence has been canceled."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        polygon = lecture.theatre.polygon()
        if not polygon:
            return Response(
                {"error": "No building polygon found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            confirmed = check_geofence(lat, lon, lecture.theatre)
        except Exception:
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
                        {"error": "Attendance already recorded."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
        except IntegrityError:
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
