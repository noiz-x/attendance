from django.contrib import admin
from django.contrib.gis.admin import GISModelAdmin

from .models import Theatre, Course, Lecture, Registration, Attendance

@admin.register(Theatre)
class TheatreAdmin(GISModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('course_code',)
    search_fields = ('course_code',)

@admin.register(Lecture)
class LectureAdmin(admin.ModelAdmin):
    list_display = ('course', 'theatre', 'start_time', 'end_time', 'canceled')
    list_filter = ('course', 'theatre', 'canceled')
    search_fields = ('course__course_code', 'theatre__name')

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'status', 'registered_at')
    list_filter = ('status', 'course')
    search_fields = ('student__username', 'course__course_code')

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'lecture', 'timestamp')
    list_filter = ('lecture__course', 'timestamp')
    search_fields = ('student__username', 'lecture__course__course_code')
