from django.contrib.gis.admin import GISModelAdmin
from django.contrib import admin
from .models import Theatre, Lecture, Attendance
from .forms import TheatreAdminForm

@admin.register(Theatre)
class TheatreAdmin(GISModelAdmin):
    form = TheatreAdminForm
    list_display = ('name', 'center')
    search_fields = ('name',)

@admin.register(Lecture)
class LectureAdmin(admin.ModelAdmin):
    list_display = ('course_name', 'theatre', 'start_time', 'end_time')
    list_filter = ('theatre',)

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'lecture', 'timestamp')
    list_filter = ('lecture',)
