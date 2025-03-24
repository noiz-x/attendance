// Frontend/src/services/attendanceService.js

import api from "./api";

const AttendanceService = {
  // Record attendance via geolocation
  recordAttendance: (data) => {
    // POST /attendance/
    return api.post("attendance/", data);
  },

  // List all courses
  listCourses: () => {
    // GET /courses/
    return api.get("courses/");
  },

  // Get details for a specific course by ID
  getCourse: (id) => {
    // GET /courses/{id}/
    return api.get(`courses/${id}/`);
  },

  // List all lectures
  listLectures: () => {
    // GET /lectures/
    return api.get("lectures/");
  },

  // Get details for a specific lecture by ID
  getLecture: (id) => {
    // GET /lectures/{id}/
    return api.get(`lectures/${id}/`);
  },

  // List registrations
  listRegistrations: () => {
    // GET /registrations/
    return api.get("registrations/");
  },

  // Create a new registration
  createRegistration: (data) => {
    // POST /registrations/
    return api.post("registrations/", data);
  },

  // Get a registration by ID
  getRegistration: (id) => {
    // GET /registrations/{id}/
    return api.get(`registrations/${id}/`);
  },

  // Update a registration (full update)
  updateRegistration: (id, data) => {
    // PUT /registrations/{id}/
    return api.put(`registrations/${id}/`, data);
  },

  // Partial update of a registration
  partialUpdateRegistration: (id, data) => {
    // PATCH /registrations/{id}/
    return api.patch(`registrations/${id}/`, data);
  },

  // Delete a registration
  deleteRegistration: (id) => {
    // DELETE /registrations/{id}/
    return api.delete(`registrations/${id}/`);
  },
};

export default AttendanceService;
