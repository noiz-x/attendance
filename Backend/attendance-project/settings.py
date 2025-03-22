# Backend/attendance-project/settings.py

"""
attendance-project/settings.py

Django settings for the attendance project.
This file includes configurations for installed apps, middleware, database,
security (JWT, CSRF, CORS), and third-party services.
"""

from pathlib import Path
from dotenv import load_dotenv
import os
from datetime import timedelta

load_dotenv()

# Base directory of the project.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("SECRET_KEY", "django-insecure-...")

# Debug mode flag.
DEBUG = os.getenv("DEBUG", "True") == "True"

# Allowed hosts for the project.
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

# Application definition
INSTALLED_APPS = [
    # Django core apps.
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.gis",
    "django.contrib.sites",  # Required by allauth.

    # Project apps.
    "accounts",    # Custom user model and authentication.
    "attendance",  # Attendance management and geofencing.
    "recurrence",  # For managing recurring events.

    # Third-party apps.
    "rest_framework",
    "drf_yasg",  # Swagger API documentation.
    "corsheaders",  # CORS support.
    "dj_rest_auth",
    "dj_rest_auth.registration",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "rest_framework.authtoken",
]

# Required for django-allauth.
SITE_ID = 1

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "allauth.account.middleware.AccountMiddleware",  # Required by allauth.
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "attendance-project.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "attendance-project.wsgi.application"

# Database configuration (using PostGIS for geospatial data).
DATABASES = {
    "default": {
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "NAME": os.getenv("DB_NAME", "gis"),
        "USER": os.getenv("DB_USER", "atsuomi"),
        "PASSWORD": os.getenv("DB_PASSWORD", "qw"),
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", ""),
    }
}

# Password validators.
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Africa/Lagos"  # Ensure this timezone is valid.
USE_I18N = True
USE_TZ = True

# Static files configuration.
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# CORS and CSRF configuration.
CORS_ALLOW_ALL_ORIGINS = os.getenv("CORS_ALLOW_ALL_ORIGINS", "True") == "True"
CORS_ALLOW_CREDENTIALS = os.getenv("CORS_ALLOW_CREDENTIALS", "True") == "True"
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
CSRF_TRUSTED_ORIGINS = os.getenv("CSRF_TRUSTED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")

# Email backend for development.
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Django-allauth settings.
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = "mandatory"
ACCOUNT_LOGIN_METHODS = ["username"]
ACCOUNT_CONFIRM_EMAIL_ON_GET = True

# JWT settings.
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
}

# Django REST Framework settings.
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
    "DEFAULT_SCHEMA_CLASS": "rest_framework.schemas.coreapi.AutoSchema",
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.UserRateThrottle",
        "rest_framework.throttling.AnonRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "user": "100/hour",
        "anon": "50/hour",
    },
}

# dj_rest_auth settings.
REST_AUTH = {
    "REGISTER_SERIALIZER": "accounts.serializers.RegistrationSerializer",
    "USER_DETAILS_SERIALIZER": "accounts.serializers.AppUserDetailsSerializer",
    "LOGIN_SERIALIZER": "accounts.serializers.AppLoginSerializer",
    "USE_JWT": True,
    "JWT_AUTH_HTTPONLY": True,  # Use HttpOnly cookies for security.
    "OLD_PASSWORD_FIELD_ENABLED": True,
}

# Disable token models since JWT is used exclusively.
TOKEN_MODEL = None
DJ_REST_AUTH_TOKEN_MODEL = None

# Specify the custom user model.
AUTH_USER_MODEL = "accounts.CustomUser"
