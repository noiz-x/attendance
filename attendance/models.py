from django.contrib.gis.db import models as geomodels
from django.db import models
from django.contrib.auth.models import User

class Theatre(geomodels.Model):
    name = models.CharField(max_length=255)
    # The geographic center stored as a Point (SRID=4326 for WGS84)
    center = geomodels.PointField(srid=4326)
    # Fallback circular geofence parameters (in meters)
    geofence_radius = models.FloatField(default=750)
    error_margin = models.FloatField(default=150)
    # Optional polygon geofence for more precise boundaries
    geofence = geomodels.PolygonField(null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        indexes = [
            geomodels.Index(fields=['center']),
        ]

class Lecture(models.Model):
    theatre = models.ForeignKey(Theatre, on_delete=models.CASCADE)
    course_name = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    def __str__(self):
        return f"{self.course_name} on {self.start_time.strftime('%Y-%m-%d %H:%M')}"

class Attendance(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    # Calculated distance in meters if circular geofence is used (null if polygon is used)
    distance = models.FloatField(null=True, blank=True)
    percentage = models.FloatField()
    confirmed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.username} - {self.lecture} at {self.timestamp}"
