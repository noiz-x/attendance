from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction, IntegrityError
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import Course, Lecture, Registration, Attendance
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
    """
    Endpoint for recording attendance via geolocation.
    Expects: latitude, longitude, and lecture_id.
    Checks the geofence and records attendance with an `attended` flag.
    """
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request):
        # Validate latitude and longitude.
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

        # Retrieve the lecture and ensure it is valid.
        lecture = get_object_or_404(Lecture, id=lecture_id)
        if lecture.canceled:
            return Response(
                {"error": "This lecture has been canceled."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        polygon = lecture.theatre.polygon()
        if not polygon:
            return Response(
                {"error": "No building polygon found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Check the geofence.
        try:
            confirmed = check_geofence(lat, lon, lecture.theatre)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create the attendance record with concurrency protection.
        try:
            with transaction.atomic():
                Attendance.objects.create(
                    student=request.user,
                    lecture=lecture,
                    attended=confirmed,
                )
        except IntegrityError:
            return Response(
                {"error": "Attendance already recorded or a concurrency error occurred."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except DjangoValidationError as e:
            return Response(
                {"error": e.messages},
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
