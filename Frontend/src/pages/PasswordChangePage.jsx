import React, { useState } from "react";
import { changePassword } from "../api";
import { useNavigate } from "react-router-dom";

const PasswordChangePage = () => {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password1: "",
    new_password2: "",
  });
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await changePassword(token, formData.old_password, formData.new_password1, formData.new_password2);
      setFeedback("Password changed successfully!");
      navigate("/accounts/user/");
    } catch (error) {
      setFeedback(error.detail || "Password change failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h2 className="text-3xl font-bold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input type="password" name="old_password" placeholder="Old Password" required onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="password" name="new_password1" placeholder="New Password" required onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="password" name="new_password2" placeholder="Confirm New Password" required onChange={handleChange} className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Change Password</button>
      </form>
      {feedback && <p className="mt-4 text-red-600">{feedback}</p>}
    </div>
  );
};

export default PasswordChangePage;
