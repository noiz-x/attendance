// Frontend/src/api.js

import axios from "axios";

// Create an axios instance with a base URL
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to log in the user and obtain a JWT token
export const loginUser = async (username, password) => {
  try {
    const response = await apiClient.post("login/", { username, password });
    // Expected response: { access: 'JWT_ACCESS_TOKEN', refresh: 'JWT_REFRESH_TOKEN' }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Function to record attendance using the provided token
export const recordAttendance = async (
  token,
  lecture_id,
  latitude,
  longitude
) => {
  try {
    const response = await apiClient.post(
      "attendance/",
      { lecture_id, latitude, longitude },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
