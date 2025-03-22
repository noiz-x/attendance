# Backend/accounts/urls.py

"""
accounts/urls.py

URL configuration for account-related endpoints.
This includes email confirmation and endpoints provided by dj_rest_auth.
"""

from django.urls import path, re_path, include
from accounts.views import email_confirm_view

urlpatterns = [
    re_path(
        r'^registration/account-confirm-email/(?P<key>[-:\w]+)/$',
        email_confirm_view,
        name="account_confirm_email"
    ),
    path('registration/', include('dj_rest_auth.registration.urls')),
    path('', include('dj_rest_auth.urls')),
    # Use re_path to capture keys that include colons or dashes.
]