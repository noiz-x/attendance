# Backend/attendance/serializers.py

"""
attendance/serializers.py

This module defines serializers for the attendance app models,
specifically for creating attendance records.
"""

from datetime import datetime, timedelta
from rest_framework import serializers
from django.db import transaction, IntegrityError
from .models import Attendance, Lecture, Course, Registration, Theatre

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'course_title', "course_code"]

class TheatreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theatre
        fields = ['id', 'name']

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

    occurrences = serializers.SerializerMethodField()
    course = CourseSerializer(read_only=True)
    theatre = TheatreSerializer(read_only=True)

    class Meta:
        model = Lecture
        fields = [
            'id',
            'course',
            'theatre',
            'start_date',
            'start_time',
            'end_time',
            'recurrence',
            'occurrences'
        ]

    def get_occurrences(self, obj):
        """
        Compute lecture occurrences based on the recurrence field's "repeat until" value.
        - Combines start_date (offset by one week) and start_time to form the initial occurrence datetime.
        - Attempts to extract an "until" datetime from the recurrence rule.
        - If no "until" is provided, defaults to a window of 30 days.
        - Uses the recurrence's built-in between() method to list occurrences.
        """
        # Adjust dtstart to start one week before the actual start_date
        dtstart = datetime.combine(obj.start_date - timedelta(weeks=1), obj.start_time)

        # No recurrence? Return the starting occurrence.
        if not obj.recurrence:
            return [dtstart.isoformat()]

        dtend = None
        # Look for the "until" property in the recurrence rules.
        # (Assuming a single rule; if multiple rules exist, you may need to adjust this logic.)
        for rule in obj.recurrence.rrules:
            if rule.until:
                dtend = rule.until
                break

        # If no until is specified in the recurrence rule, default to 30 days from the start.
        if dtend is None:
            dtend = dtstart + timedelta(days=30)

        occurrences = obj.recurrence.between(dtstart, dtend, dtstart=dtstart)
        return [occ.isoformat() for occ in occurrences]


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
