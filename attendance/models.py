# attendance/models.py
from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class Theatre(models.Model):
    name = models.CharField(max_length=255)
    center_lat = models.FloatField()
    center_lon = models.FloatField()
    geofence_radius = models.FloatField(default=750)  # in meters
    error_margin = models.FloatField(default=150)       # error margin for 100% attendance
    polygon_coordinates = models.JSONField(null=True, blank=True)  # Expects list of [lon, lat] pairs

    def clean(self):
        """Validate polygon_coordinates if provided."""
        super().clean()
        if self.polygon_coordinates:
            if not isinstance(self.polygon_coordinates, list):
                raise ValidationError("Polygon coordinates must be a list of [lon, lat] pairs.")
            if len(self.polygon_coordinates) < 3:
                raise ValidationError("A polygon requires at least 3 points.")
            for coord in self.polygon_coordinates:
                if not (isinstance(coord, list) or isinstance(coord, tuple)):
                    raise ValidationError("Each coordinate must be a list or tuple.")
                if len(coord) != 2:
                    raise ValidationError("Each coordinate must have exactly two values: [lon, lat].")
                try:
                    float(coord[0])
                    float(coord[1])
                except (TypeError, ValueError):
                    raise ValidationError("Coordinate values must be numeric.")

    def __str__(self):
        return self.name

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
    distance = models.FloatField(null=True, blank=True)  # May be null when using polygon geofence
    percentage = models.FloatField()
    confirmed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.username} - {self.lecture} at {self.timestamp}"
