from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class LoginAPIView(APIView):
    # Allow any user to try to login
    permission_classes = []

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Username and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Authenticate the user using Django's built-in authentication
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # Login successful; return the user's id as student_id
            return Response({'student_id': user.id}, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Invalid credentials.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
