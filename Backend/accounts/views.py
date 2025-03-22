# Backend/accounts/views.py

"""
accounts/views.py

This module defines views for account-related actions.
Here, the default email confirmation view from django-allauth is wrapped
with csrf_exempt to simplify email confirmation via GET requests.
"""

from django.views.decorators.csrf import csrf_exempt
from allauth.account.views import confirm_email

# Wrap the default confirm_email view to exempt CSRF protection
email_confirm_view = csrf_exempt(confirm_email)
# ! Issue:
# ! The email confirmation view is marked as CSRF exempt.

# ! Optimization:

# ! Review GET vs. POST:
# ! Since email confirmations typically use a token-based GET request that is idempotent, the exemption can be acceptable if no state-changing operations occur.

# ! Audit the Flow:
# ! Ensure that no sensitive operations (like account activation) are triggered by GET requests beyond confirming the token. Consider moving to a POST request if further state changes become necessary.

# ! Reference: Proven methods for safely implementing email confirmations are discussed in various Django security guides
