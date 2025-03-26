// Frontend/src/services/api.js

import axios from "axios";

const api = axios.create({
  // baseURL: "https://sharp-papers-wave.loca.lt/", // Your Django backend URL
  baseURL: "http://127.0.0.1:8000/", // Your Django backend URL
});

// Request interceptor to attach the JWT token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized responses (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear the stored token
      localStorage.removeItem("access");
      // Redirect the user to the login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
