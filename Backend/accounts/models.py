# Backend/accounts/models.py

"""
accounts/models.py

This module defines the custom user model (CustomUser) for the application.
The CustomUser extends Django's AbstractUser and includes a 'role' field
to differentiate between student and lecturer accounts.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    STUDENT = 'student'
    LECTURER = 'lecturer'
    ROLE_CHOICES = [
        (STUDENT, 'Student'),
        (LECTURER, 'Lecturer'),
    ]
    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=STUDENT,
        help_text="Designates the role of the user."
    )
    
    class Meta:
        permissions = [
            ("can_view_lecture", "Can view lecture details"),
            ("can_manage_attendance", "Can manage attendance records"),
            ("can_create_lecture", "Can create lectures"),
        ]
        
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
