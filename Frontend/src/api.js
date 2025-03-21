import axios from "axios";

// const API_BASE_URL = "http://127.0.0.1:8000/accounts/";
// const ATTENDANCE_API_URL = "http://127.0.0.1:8000/api/attendance/";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ATTENDANCE_API_URL = import.meta.env.VITE_ATTENDANCE_API_URL;

// Authentication endpoints
export const loginUser = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}login/`, { username, password });
  return response.data;
};

export const logoutUser = async (token) => {
  const response = await axios.post(
    `${API_BASE_URL}logout/`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const registerUser = async (username, email, password1, password2) => {
  const response = await axios.post(`${API_BASE_URL}registration/`, {
    username,
    email,
    password1,
    password2,
  });
  return response.data;
};

export const changePassword = async (token, old_password, new_password1, new_password2) => {
  const response = await axios.post(
    `${API_BASE_URL}password/change/`,
    { old_password, new_password1, new_password2 },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const resetPassword = async (email) => {
  const response = await axios.post(`${API_BASE_URL}password/reset/`, { email });
  return response.data;
};

export const resetPasswordConfirm = async (uid, token, new_password1, new_password2) => {
  const response = await axios.post(`${API_BASE_URL}password/reset/confirm/`, {
    uid,
    token,
    new_password1,
    new_password2,
  });
  return response.data;
};

export const resendEmail = async (email) => {
  const response = await axios.post(`${API_BASE_URL}registration/resend-email/`, { email });
  return response.data;
};

export const verifyEmail = async (key) => {
  const response = await axios.post(`${API_BASE_URL}registration/verify-email/`, { key });
  return response.data;
};

export const tokenRefresh = async (refreshToken) => {
  const response = await axios.post(`${API_BASE_URL}token/refresh/`, { refresh: refreshToken });
  return response.data;
};

export const tokenVerify = async (token) => {
  const response = await axios.post(`${API_BASE_URL}token/verify/`, { token });
  return response.data;
};

export const getUserDetails = async (token) => {
  const response = await axios.get(`${API_BASE_URL}user/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Attendance endpoint (example uses GET; adjust to POST if needed)
export const getAttendance = async (token) => {
  // Wrap navigator.geolocation in a Promise for async/await usage
  const getLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    });

  let position;
  try {
    position = await getLocation();
  } catch (error) {
    console.error("Error getting location:", error);
    throw error;
  }

  const { latitude, longitude } = position.coords;
  console.log("Latitude:", latitude, "Longitude:", longitude);

  const response = await axios.post(
    ATTENDANCE_API_URL,
    { latitude, longitude},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

