from django.contrib.gis.db import models as geomodels
from django.db import models, transaction
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils import timezone
import recurrence.fields  # django-recurrence field import

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
    """
    Represents a recurring lecture for a course.
    Each record defines a recurring lecture for a particular time slot.
    """
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lectures')
    theatre = models.ForeignKey(Theatre, on_delete=models.CASCADE)
    start_date = models.DateField(default=timezone.now, help_text="Date when recurrence begins")
    end_date = models.DateField(help_text="Date until which this lecture recurs")
    start_time = models.TimeField(help_text="Start time for the lecture occurrence")
    end_time = models.TimeField(help_text="End time for the lecture occurrence")
    recurrence = recurrence.fields.RecurrenceField(
        help_text="Recurrence rule (e.g. every Monday and Friday)",
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.course.course_title} at {self.theatre.name} from {self.start_time} to {self.end_time}"

    def get_occurrences(self, from_date, to_date):
        """
        Returns a list of occurrences (as dictionaries with start and end datetime)
        for this lecture between from_date and to_date.
        """
        from datetime import datetime
        occurrences = []
        if self.recurrence:
            dates = self.recurrence.between(from_date, to_date, inc=True)
            for d in dates:
                start_dt = datetime.combine(d, self.start_time)
                end_dt = datetime.combine(d, self.end_time)
                occurrences.append({'start': start_dt, 'end': end_dt})
        return occurrences

class CanceledOccurrence(models.Model):
    """
    Stores canceled occurrences for a recurring lecture.
    This lets you cancel one or more specific dates without canceling the entire series.
    """
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE, related_name='canceled_occurrences')
    occurrence_date = models.DateField()

    class Meta:
        unique_together = ('lecture', 'occurrence_date')

    def __str__(self):
        return f"{self.lecture} canceled on {self.occurrence_date}"

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

    def __str__(self):
        return f"{self.student.username} registered for {self.course} [{self.status}]"

class Attendance(models.Model):
    """
    Records attendance for a specific occurrence of a recurring lecture.
    'occurrence_date' identifies the date of the occurrence.
    The 'attended' flag indicates whether the student was within the geofence.
    """
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
    occurrence_date = models.DateField(help_text="The date when this lecture occurrence happened")
    timestamp = models.DateTimeField(auto_now_add=True)
    attended = models.BooleanField(default=False, help_text="True if student was in the geofence")

    class Meta:
        unique_together = ('student', 'lecture', 'occurrence_date')

    def clean(self):
        # Check if this specific occurrence is canceled.
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
        self.clean()  # Validate before saving.
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student.username} attended {self.lecture} on {self.occurrence_date} (Attended: {self.attended})"
