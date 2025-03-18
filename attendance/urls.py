from django.urls import path
from .views import index, check_attendance_geofence, check_attendance_polygon

urlpatterns = [
    path('', index, name='index'),
    path('check-circular/', check_attendance_geofence, name='check_circular'),
    path('check-polygon/', check_attendance_polygon, name='check_polygon'),
];
