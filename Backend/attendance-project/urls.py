# Backend/attendance-project/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('attendance.urls')),
    # dj_rest_auth endpoints for login, logout, etc.
    path('accounts/', include('accounts.urls')),
]
