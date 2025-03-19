# attendance/admin.py
from django.contrib import admin
from .models import Theatre, Lecture, Attendance
from .forms import TheatreAdminForm

@admin.register(Theatre)
class TheatreAdmin(admin.ModelAdmin):
    form = TheatreAdminForm
    list_display = ('name', 'center_lat', 'center_lon', 'geofence_radius', 'error_margin')
    search_fields = ('name',)

@admin.register(Lecture)
class LectureAdmin(admin.ModelAdmin):
    list_display = ('course_name', 'theatre', 'start_time', 'end_time')
    list_filter = ('theatre',)

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'lecture', 'timestamp', 'distance', 'percentage', 'confirmed')
    list_filter = ('confirmed', 'lecture')
