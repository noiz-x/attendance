# attendance/models.py
from django.db import models
from django.contrib.auth.models import User

class Theatre(models.Model):
    name = models.CharField(max_length=255)
    center_lat = models.FloatField()
    center_lon = models.FloatField()
    geofence_radius = models.FloatField(default=750)  # in meters
    error_margin = models.FloatField(default=150)       # within this, 100%

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
    distance = models.FloatField()         # in meters
    percentage = models.FloatField()       # computed value
    confirmed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.username} - {self.lecture} at {self.timestamp}"
