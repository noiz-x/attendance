from rest_framework import serializers
from django.db import transaction, IntegrityError
from .models import Attendance, Lecture, Course, Registration

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['id', 'lecture', 'timestamp']
        read_only_fields = ['timestamp']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['student'] = request.user
        try:
            with transaction.atomic():
                attendance = Attendance.objects.create(**validated_data)
        except IntegrityError:
            raise serializers.ValidationError("Attendance already recorded or a concurrency error occurred.")
        return attendance

class LectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    lectures = LectureSerializer(many=True, read_only=True)
    class Meta:
        model = Course
        fields = ['id', 'course_code', 'lectures']

class CourseRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = ['id', 'course', 'registered_at', 'status']
        read_only_fields = ['registered_at', 'status']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['student'] = request.user
        return Registration.objects.create(**validated_data)
