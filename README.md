
# Attendance

This project is a Django-based web application for managing attendance. It allows users to mark attendance, view attendance records, and generate reports.

## Features

- User authentication and authorization
- Mark attendance for students
- View attendance records
- Generate attendance reports
- Admin dashboard

## Installation

1. Clone the repository:
  ```bash
  git clone https://github.com/noiz-x/attendance.git
  ```
2. Navigate to the project directory:
  ```bash
  cd attendance
  ```
3. Create a virtual environment:
  ```bash
  python3 -m venv venv
  ```
4. Activate the virtual environment:
  - On Windows:
    ```bash
    venv\Scripts\activate
    ```
  - On macOS/Linux:
    ```bash
    source venv/bin/activate
    ```
5. Install the required packages:
  ```bash
  pip install -r requirements.txt
  ```
6. Apply migrations:
  ```bash
  python manage.py migrate
  ```
7. Create a superuser:
  ```bash
  python manage.py createsuperuser
  ```
8. Run the development server:
  ```bash
  python manage.py runserver
  ```

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