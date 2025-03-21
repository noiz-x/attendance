import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/accounts/";

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}login/`, {
      username,
      password,
    });
    return response.data; // Expected: { access, refresh } (if using JWT) or { key } (if using token auth)
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const registerUser = async (username, email, password1, password2) => {
  try {
    const response = await axios.post(`${API_BASE_URL}registration/`, {
      username,
      email,
      password1,
      password2,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getUserDetails = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}user/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
