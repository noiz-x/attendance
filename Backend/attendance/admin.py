# Backend/attendance/admin.py

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
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('course_code', 'course_title')
    search_fields = ('course_code', 'course_title')

@admin.register(Lecture)
class LectureAdmin(admin.ModelAdmin):
    list_display = ('course', 'theatre', 'start_date', 'end_date', 'start_time', 'end_time')
    list_filter = ('course', 'theatre')
    search_fields = ('course__course_code', 'theatre__name')

@admin.register(CanceledOccurrence)
class CanceledOccurrenceAdmin(admin.ModelAdmin):
    list_display = ('lecture', 'occurrence_date')
    list_filter = ('lecture__course',)
    search_fields = ('lecture__course__course_code',)

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'status', 'registered_at')
    list_filter = ('status', 'course')
    search_fields = ('student__username', 'course__course_code')

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    # Note: Attendance now uses lecture and occurrence_date.
    list_display = ('student', 'lecture', 'occurrence_date', 'timestamp', 'attended')
    list_filter = ('lecture__course', 'timestamp', 'attended')
    search_fields = ('student__username', 'lecture__course__course_code')
