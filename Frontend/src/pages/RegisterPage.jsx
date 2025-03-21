// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { registerUser } from "../api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(
        formData.username,
        formData.email,
        formData.password1,
        formData.password2
      );
      setFeedback("Registration successful!");
      navigate("/accounts/login/");
    } catch (error) {
      setFeedback(error.detail || "Registration failed.");
    }
  };

  return (
    <Layout heading="Enroll at Vista Charter Public Schools">
      <div className="bg-white p-6 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Register</h2>
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
              Email
            </label>
            <input
              type="email"
              name="email"
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
              name="password1"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="password2"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Register
          </button>
        </form>
        {feedback && <p className="mt-4 text-red-600">{feedback}</p>}
      </div>
    </Layout>
  );
};

export default RegisterPage;
