# attendance/urls.py
from django.urls import path
from .views import index, check_attendance_geofence
from .api_views import CheckAttendance

urlpatterns = [
    path('', index, name='index'),
    path('api/check-attendance/', CheckAttendance.as_view(), name='check_attendance'),
    path('api/check-geofence/', check_attendance_geofence, name='check_geofence'),
]
