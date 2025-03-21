from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AttendanceViewSet
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

router = DefaultRouter()
router.register(r"attendance", AttendanceViewSet, basename="attendance")

schema_view = get_schema_view(
    openapi.Info(
        title="Attendance API",
        default_version="v1",
        description="API documentation for the attendance project",
        contact=openapi.Contact(email="contact@example.com"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("api/", include(router.urls)),
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
]
