# Backend/accounts/views.py

from django.views.decorators.csrf import csrf_exempt
from allauth.account.views import confirm_email

# Wrap the default confirm_email view to exempt CSRF protection
email_confirm_view = csrf_exempt(confirm_email)
