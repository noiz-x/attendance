// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData.username, formData.password);
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      navigate("/accounts/user/");
    } catch (error) {
      setFeedback(error.detail || "Login failed.");
    }
  };

  return (
    <Layout heading="Login to Vista Charter Public Schools">
      <div className="bg-white p-6 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Log In
          </button>
        </form>
        {feedback && <p className="mt-4 text-red-600">{feedback}</p>}
      </div>
    </Layout>
  );
};

export default LoginPage;
