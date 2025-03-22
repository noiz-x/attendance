# Backend/attendance-project/urls.py

"""
attendance-project/urls.py

URL configuration for the attendance project.
Maps URLs to views for admin, attendance, and account-related endpoints.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Admin site URLs.
    path('admin/', admin.site.urls),
    # Attendance app endpoints.
    path('', include('attendance.urls')),
    # Authentication endpoints provided by dj_rest_auth and allauth.
    path('accounts/', include('accounts.urls')),
]
