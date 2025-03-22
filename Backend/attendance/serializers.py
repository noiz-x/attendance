# Backend/attendance/serializers.py

"""
attendance/serializers.py

This module defines serializers for the attendance app models,
specifically for creating attendance records.
"""

from rest_framework import serializers
from django.db import transaction, IntegrityError
from .models import Attendance, Lecture, Course, Registration

class AttendanceSerializer(serializers.ModelSerializer):
    """
    Serializer for the Attendance model.
    The 'occurrence_date' field is optional and will default to today's date if omitted.
    """
    occurrence_date = serializers.DateField(required=False)

    class Meta:
        model = Attendance
        fields = ['id', 'lecture', 'occurrence_date', 'timestamp', 'attended']
        read_only_fields = ['timestamp']

    def create(self, validated_data):
        """
        Create an attendance record with concurrency protection.
        Sets the student from the request context and defaults the occurrence_date.
        """
        request = self.context.get('request')
        validated_data['student'] = request.user
        if 'occurrence_date' not in validated_data:
            validated_data['occurrence_date'] = timezone.localdate()
        try:
            with transaction.atomic():
                attendance = Attendance.objects.create(**validated_data)
        except IntegrityError:
            raise serializers.ValidationError("Attendance already recorded or a concurrency error occurred.")
        return attendance

class LectureSerializer(serializers.ModelSerializer):
    """
    Serializer for the Lecture model.

    Handles serialization and deserialization of Lecture instances. This serializer
    can be used to validate and transform data related to lectures.
    """

    class Meta:
        model = Lecture
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    """
    Serializer for the Course model.

    Handles serialization and deserialization of Course instances. This serializer
    includes related lectures as a nested representation.
    """
    
    lectures = LectureSerializer(many=True, read_only=True)
    class Meta:
        model = Course
        fields = ['id', 'course_code', 'lectures']

class CourseRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for the Registration model.

    Handles validation and creation of course registration records. The 'status'
    and 'registered_at' fields are read-only and automatically managed by the system.
    """
    
    class Meta:
        model = Registration
        fields = ['id', 'course', 'registered_at', 'status']
        read_only_fields = ['registered_at', 'status']

    def create(self, validated_data):
        """
        Create a course registration record.

        This method sets the student from the request context and ensures that the
        registration is associated with the correct user. The 'status' and 'registered_at'
        fields are automatically managed by the system.
        """
        request = self.context.get('request')
        validated_data['student'] = request.user
        return Registration.objects.create(**validated_data)
