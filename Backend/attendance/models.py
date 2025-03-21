from django.contrib.gis.db import models as geomodels
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()  # This will refer to accounts.CustomUser

class Theatre(geomodels.Model):
    name = models.CharField(max_length=255)
    center = geomodels.PointField(srid=4326)

    def polygon(self, search_radius=10):
        from .utils import get_nearest_building_polygon
        return get_nearest_building_polygon(self.center, search_radius)

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

    def __str__(self):
        return f"{self.student.username} - {self.lecture} at {self.timestamp}"
