// Frontend/src/services/attendanceService.js

import api from "./api";

const AttendanceService = {
  // Record attendance via geolocation
  recordAttendance: (data) => {
    // POST /api/attendance/
    return api.post("api/attendance/", data);
  },

  // List all courses
  listCourses: () => {
    // GET /api/courses/
    return api.get("api/courses/");
  },

  // Get details for a specific course by ID
  getCourse: (id) => {
    // GET /api/courses/{id}/
    return api.get(`api/courses/${id}/`);
  },

  // List all lectures
  listLectures: () => {
    // GET /api/lectures/
    return api.get("api/lectures/");
  },

  // Get details for a specific lecture by ID
  getLecture: (id) => {
    // GET /api/lectures/{id}/
    return api.get(`api/lectures/${id}/`);
  },

  // List registrations
  listRegistrations: () => {
    // GET /api/registrations/
    return api.get("api/registrations/");
  },

  // Create a new registration
  createRegistration: (data) => {
    // POST /api/registrations/
    return api.post("api/registrations/", data);
  },

  // Get a registration by ID
  getRegistration: (id) => {
    // GET /api/registrations/{id}/
    return api.get(`api/registrations/${id}/`);
  },

  // Update a registration (full update)
  updateRegistration: (id, data) => {
    // PUT /api/registrations/{id}/
    return api.put(`api/registrations/${id}/`, data);
  },

  // Partial update of a registration
  partialUpdateRegistration: (id, data) => {
    // PATCH /api/registrations/{id}/
    return api.patch(`api/registrations/${id}/`, data);
  },

  // Delete a registration
  deleteRegistration: (id) => {
    // DELETE /api/registrations/{id}/
    return api.delete(`api/registrations/${id}/`);
  },
};

export default AttendanceService;
