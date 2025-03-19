
# Attendance

This project is a Django-based web application for managing attendance. It allows users to mark attendance, view attendance records, and generate reports.

## Geofencing and Geolocation

This project also includes advanced features such as geofencing and geolocation to ensure accurate attendance tracking:

- **Geolocation API integration:** Students check in via a frontend that retrieves their location.
- **Geofencing logic:** Both circular (with error margins) and polygon-based checks.
- **REST API:** Built with Django REST Framework for attendance verification.
- **Models:** Representing theatres, lectures, and attendance records.

## Setup

1. **Clone the repository**
  ```bash
  git clone https://github.com/noiz-x/attendance.git
  cd attendance
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

## Access the app

- **Frontend:** `http://127.0.0.1:8000/`
- **Admin panel:** `http://127.0.0.1:8000/admin/`

## Notes

- Update the CSRF trusted origins and allowed hosts in `settings.py` for production.
- Customize the frontend and API endpoints as needed.
- Use appropriate authentication and authorization mechanisms in production.

Happy coding!


## Features

- User authentication and authorization
- Mark attendance for students
- View attendance records
- Generate attendance reports
- Admin dashboard

## Usage

1. Open your web browser and go to `http://127.0.0.1:8000/`.
2. Log in with your superuser credentials.
3. Use the admin dashboard to manage attendance.

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For inquiries or feedback, please reach out via [LinkedIn](https://www.linkedin.com/in/iamgeekspe/).