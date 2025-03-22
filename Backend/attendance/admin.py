# Backend/attendance/admin.py

"""
attendance/admin.py

This module configures the Django admin interface for the attendance app models.
Each admin class includes display options, search fields, and filters to help manage data.
"""

from django.contrib import admin
from django.contrib.gis.admin import GISModelAdmin
from .models import (
    Theatre,
    Course,
    Lecture,
    CanceledOccurrence,
    Registration,
    Attendance,
)

@admin.register(Theatre)
class TheatreAdmin(GISModelAdmin):
    """
    Admin configuration for Theatre model.
    Displays the theatre name and enables search by name.
    """
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    """
    Admin configuration for Course model.
    Displays course code and title and enables search by these fields.
    """
    list_display = ('course_code', 'course_title')
    search_fields = ('course_code', 'course_title')

@admin.register(Lecture)
class LectureAdmin(admin.ModelAdmin):
    """
    Admin configuration for Lecture model.
    Displays course, theatre, dates, and times; allows filtering and search.
    """
    list_display = ('course', 'theatre', 'start_date', 'end_date', 'start_time', 'end_time')
    list_filter = ('course', 'theatre')
    search_fields = ('course__course_code', 'theatre__name')

@admin.register(CanceledOccurrence)
class CanceledOccurrenceAdmin(admin.ModelAdmin):
    """
    Admin configuration for CanceledOccurrence model.
    Displays lecture and occurrence date; allows filtering by course.
    """
    list_display = ('lecture', 'occurrence_date')
    list_filter = ('lecture__course',)
    search_fields = ('lecture__course__course_code',)

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    """
    Admin configuration for Registration model.
    Displays student, course, registration status, and timestamp.
    """
    list_display = ('student', 'course', 'status', 'registered_at')
    list_filter = ('status', 'course')
    search_fields = ('student__username', 'course__course_code')

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    """
    Admin configuration for Attendance model.
    Displays student, lecture, occurrence date, timestamp, and attendance status.
    """
    list_display = ('student', 'lecture', 'occurrence_date', 'timestamp', 'attended')
    list_filter = ('lecture__course', 'timestamp', 'attended')
    search_fields = ('student__username', 'lecture__course__course_code')
