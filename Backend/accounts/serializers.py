from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import LoginSerializer, UserDetailsSerializer
from rest_framework import serializers
from accounts.models import CustomUser

class RegistrationSerializer(RegisterSerializer):
    # Allow users to choose a role on registration; you can change this behavior as needed.
    role = serializers.ChoiceField(
        choices=CustomUser.ROLE_CHOICES, default=CustomUser.STUDENT
    )

    class Meta:
        model = CustomUser
        # Include the fields required by dj_rest_auth along with your custom field
        fields = ("username", "email", "password1", "password2", "role")

    def custom_signup(self, request, user):
        """
        Called after the user instance is created.
        Here we set the user's role based on the validated data.
        """
        user.role = self.validated_data.get("role", CustomUser.STUDENT)
        user.save()

class AppUserDetailsSerializer(UserDetailsSerializer):
    # Extend the default user details serializer to include the custom role.
    role = serializers.CharField(source="get_role_display", read_only=True)

    class Meta(UserDetailsSerializer.Meta):
        model = CustomUser
        fields = UserDetailsSerializer.Meta.fields + ("role",)

class AppLoginSerializer(LoginSerializer):
    """
    Custom login serializer.
    You can extend this class to add extra validations if required.
    For now, it simply uses the default behavior.
    """
    def validate(self, attrs):
        data = super().validate(attrs)
        # Optionally, you could add more custom validation logic here.
        return data
