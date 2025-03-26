// Frontend/src/services/attendanceService.js

import api from "./api";

const AttendanceService = {
  // Record attendance via geolocation
  recordAttendance: (data) => api.post("attendance/", data),

  // List all courses
  listCourses: () => api.get("courses/"),

  // Get details for a specific course by ID
  getCourse: (id) => api.get(`courses/${id}/`),

  // List all lectures
  listLectures: (formattedDate) => api.get(`lectures/?date=${formattedDate.date}`),

  // Get details for a specific lecture by ID
  getLecture: (id) => api.get(`lectures/${id}/`),

  // List registrations
  listRegistrations: () => api.get("registrations/"),

  // Create a new registration
  createRegistration: (data) => api.post("registrations/", data),

  // Get a registration by ID
  getRegistration: (id) => api.get(`registrations/${id}/`),

  // Update a registration (full update)
  updateRegistration: (id, data) => api.put(`registrations/${id}/`, data),

  // Partial update of a registration
  partialUpdateRegistration: (id, data) => api.patch(`registrations/${id}/`, data),

  // Delete a registration
  deleteRegistration: (id) => api.delete(`registrations/${id}/`),
};

export default AttendanceService;
