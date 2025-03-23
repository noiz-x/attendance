// Frontend/src/services/api.js

import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/", // Your Django backend URL
});

// Interceptor to attach the JWT token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
