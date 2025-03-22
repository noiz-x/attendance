from django.contrib.gis.db import models as geomodels
from django.db import models, transaction
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils import timezone

User = get_user_model()

class Theatre(geomodels.Model):
    name = models.CharField(max_length=255)
    center = geomodels.PointField(srid=4326)

    def polygon(self, search_radius=10):
        from .utils import get_nearest_building_polygon
        return get_nearest_building_polygon(self.center, search_radius)

    def __str__(self):
        return self.name

class Course(models.Model):
    course_code = models.CharField(max_length=255)
    course_title = models.CharField(max_length=255)
    # Additional course-level fields (description, credits, etc.) can be added here

    def __str__(self):
        return self.course_code

class Lecture(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lectures')
    theatre = models.ForeignKey(Theatre, on_delete=models.CASCADE)
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(default=timezone.now)
    canceled = models.BooleanField(default=False)  # If True, lecture is canceled

    def __str__(self):
        status = " (Canceled)" if self.canceled else ""
        return f"{self.course.course_title} lecture on {self.start_time.strftime('%Y-%m-%d %H:%M')} at {self.theatre.name}{status}"

class Registration(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('revoked', 'Revoked'),
        ('expired', 'Expired'),
    )
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    registered_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')

    class Meta:
        unique_together = ('student', 'course')
        # Alternatively, for Django 2.2+ you can use UniqueConstraint

    def __str__(self):
        return f"{self.student.username} registered for {self.course} [{self.status}]"

class Attendance(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'lecture')
        # Alternatively, use UniqueConstraint for Django 2.2+

    def clean(self):
        # Prevent attendance if the lecture is canceled.
        if self.lecture.canceled:
            raise ValidationError("This lecture has been canceled.")
        # Ensure the student is actively registered for the course of this lecture.
        if not Registration.objects.filter(
            student=self.student,
            course=self.lecture.course,
            status='active'
        ).exists():
            raise ValidationError("You are not actively registered for this course.")

    def save(self, *args, **kwargs):
        self.clean()  # Always validate before saving.
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student.username} attended {self.lecture} at {self.timestamp}"
