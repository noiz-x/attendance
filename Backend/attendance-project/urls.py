from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # dj_rest_auth endpoints for login, logout, etc.
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    # Registration endpoints for new users
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    # Include attendance app endpoints
    path('', include('attendance.urls')),
]
