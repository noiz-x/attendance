# Backend/attendance/models.py

"""
attendance/models.py

This module defines the models for the attendance app:
- Theatre: Represents a venue with geospatial data.
- Course: Contains course information.
- Lecture: Defines a recurring lecture for a course.
- CanceledOccurrence: Stores dates when a lecture occurrence is canceled.
- Registration: Records a student's registration for a course.
- Attendance: Records whether a student attended a lecture occurrence.
"""

from django.contrib.gis.db import models as geomodels
from django.db import models, transaction
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils import timezone
import recurrence.fields  # django-recurrence field import

User = get_user_model()

class Theatre(geomodels.Model):
    """
    Represents a theatre (or venue) with geospatial information.
    """
    name = models.CharField(max_length=255)
    center = geomodels.PointField(srid=4326)

    def polygon(self, search_radius=10):
        """
        Retrieves the building polygon for this theatre.
        Calls an external API via a utility function to get the polygon
        based on the centre point and search radius.
        """
        from .utils import get_nearest_building_polygon
        return get_nearest_building_polygon(self.center, search_radius)

    def __str__(self):
        return self.name

class Course(models.Model):
    """
    Represents a course with its code and title.
    """
    course_code = models.CharField(max_length=255)
    course_title = models.CharField(max_length=255)

    def __str__(self):
        return self.course_code

class Lecture(models.Model):
    """
    Represents a recurring lecture for a course.
    Includes the course, venue (theatre), timing details, and recurrence rules.
    """
    course = models.ForeignKey('Course', on_delete=models.CASCADE, related_name='lectures')
    theatre = models.ForeignKey('Theatre', on_delete=models.CASCADE)
    start_date = models.DateField(default=timezone.now, help_text="Date when recurrence begins")
    start_time = models.TimeField(help_text="Start time for the lecture occurrence")
    end_time = models.TimeField(help_text="End time for the lecture occurrence")
    recurrence = recurrence.fields.RecurrenceField(
        help_text="Recurrence rule (e.g. every Monday and Friday with a repeat until date)",
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.course.course_title} at {self.theatre.name} from {self.start_time} to {self.end_time}"

class CanceledOccurrence(models.Model):
    """
    Stores canceled occurrences for a lecture.
    Allows cancelling individual occurrences without canceling the entire series.
    """
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE, related_name='canceled_occurrences')
    occurrence_date = models.DateField()

    class Meta:
        unique_together = ('lecture', 'occurrence_date')

    def __str__(self):
        return f"{self.lecture} canceled on {self.occurrence_date}"

class Registration(models.Model):
    """
    Records a student's registration for a course.
    Enforces a unique constraint so that a student can register only once per course.
    """
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

    def __str__(self):
        return f"{self.student.username} registered for {self.course} [{self.status}]"

class Attendance(models.Model):
    """
    Records attendance for a lecture occurrence.
    Indicates whether the student was within the geofence of the theatre.
    """
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
    occurrence_date = models.DateField(help_text="The date when this lecture occurrence happened")
    timestamp = models.DateTimeField(auto_now_add=True)
    attended = models.BooleanField(default=False, help_text="True if student was in the geofence")

    class Meta:
        unique_together = ('student', 'lecture', 'occurrence_date')

    def clean(self):
        """
        Validate the attendance record:
          - Ensure the lecture occurrence is not canceled.
          - Verify that the student is actively registered for the course.
        """
        if self.lecture.canceled_occurrences.filter(occurrence_date=self.occurrence_date).exists():
            raise ValidationError("This lecture occurrence has been canceled.")
        # Ensure the student is actively registered for the course.
        if not Registration.objects.filter(
            student=self.student,
            course=self.lecture.course,
            status='active'
        ).exists():
            raise ValidationError("You are not actively registered for this course.")

    def save(self, *args, **kwargs):
        """
        Overrides the save method to run validations before saving.
        """
        self.clean()  # Validate before saving.
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student.username} attended {self.lecture} on {self.occurrence_date} (Attended: {self.attended})"
