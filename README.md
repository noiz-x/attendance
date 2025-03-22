# Attendance

Attendance is a robust Django-based web application for managing attendance in academic settings. It combines advanced geofencing and geolocation capabilities with a comprehensive REST API, a custom user model with role-based permissions, and a polished admin dashboard for seamless management.

## Features

- **Geolocation API Integration:**  
  Students check in via a frontend that retrieves their real-time location.

- **Geofencing Logic:**  
  Supports polygon-based geofence checks, with error margins to handle GPS inaccuracies. The building polygon data is cached to reduce external API calls.

- **REST API:**  
  Built using Django REST Framework (DRF) with endpoints for attendance verification. The API leverages JWT authentication with secure, short-lived access tokens and robust concurrency protection.

- **Models:**  
  - **Theatre:** Contains geospatial data for venue mapping.  
  - **Course & Lecture:** Define courses and recurring lectures (with cancellation support).  
  - **Registration & Attendance:** Manage student course registrations and record attendance based on geolocation.

- **Admin Dashboard:**  
  Manage courses, lectures, registrations, cancellations, and attendance records through a user-friendly Django admin interface.

- **Authentication & Security:**  
  - Custom user roles (`student` and `lecturer`) with specific permissions.  
  - Email confirmation handled via Django Allauth (with CSRF exemptions for safe GET-based confirmations).  
  - Secure JWT settings with short access token lifetimes, HttpOnly cookies, and rate limiting via DRF throttling.
  
- **API Documentation:**  
  Interactive Swagger UI is available for exploring and testing the API endpoints.

- **Frontend:**  
  Built with React and Tailwind CSS, offering a responsive interface for students and lecturers.

## Setup

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/noiz-x/attendance.git
   cd attendance/Backend
   ```

2. **Create a virtual environment and install dependencies**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Run migrations**

   ```bash
   python manage.py migrate
   ```

4. **Create a superuser**

   ```bash
   python manage.py createsuperuser
   ```

5. **Run the development server**

   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to the frontend directory**

   ```bash
   cd attendance/Frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   npm install react-router-dom axios tailwindcss @tailwindcss/vite
   ```

3. **Configure Tailwind with Vite**

   - **vite.config.ts:**  
     Create or update your Vite configuration file with the Tailwind plugin.
     ```typescript
     import { defineConfig } from 'vite'
     import tailwindcss from '@tailwindcss/vite'
     
     export default defineConfig({
       plugins: [
         tailwindcss(),
       ],
     })
     ```

   - **Import Tailwind CSS:**  
     In your main CSS file, add the following line to import Tailwind’s base styles:
     ```css
     @import "tailwindcss";
     ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

## Access the App

- **Frontend:** [http://127.0.0.1:5173/](http://127.0.0.1:5173/)
- **Admin Panel:** [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)
- **API Documentation (Swagger):** [http://127.0.0.1:8000/swagger/](http://127.0.0.1:8000/swagger/)

## Key Enhancements

- **Caching for Geofencing:**  
  The building polygon is retrieved via the Overpass API and cached for one hour, reducing external API calls and improving performance.

- **Concurrency Protection:**  
  Attendance records are created using atomic transactions with `get_or_create` to ensure that duplicate records cannot be created even with simultaneous requests.

- **Enhanced Security:**  
  - **JWT Authentication:** Access tokens are now set with a 15-minute lifetime, with refresh tokens in place to reduce risk.  
  - **Error Handling:** Detailed errors are logged server-side while generic messages are returned to clients to prevent internal data leaks.  
  - **Rate Limiting:** DRF throttling is configured to mitigate brute force and DoS attacks.

- **Robust Geofencing:**  
  Improved geofencing logic accurately validates the user's location against buffered polygon data of the theatre to ensure reliable attendance verification.

## Usage

1. Open your web browser and navigate to the frontend URL: [http://127.0.0.1:5173/](http://127.0.0.1:5173/).
2. Log in with your credentials.
3. Use the dashboard to mark attendance, manage courses/lectures, and view attendance records.

## Contributing

Contributions are welcome! Please review the [contributing guidelines](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For inquiries or feedback, please reach out via [LinkedIn](https://www.linkedin.com/in/iamgeekspe/).
