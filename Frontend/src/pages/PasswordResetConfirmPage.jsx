import React, { useState } from "react";
import { resetPasswordConfirm } from "../api";
import { useSearchParams, useNavigate } from "react-router-dom";

const PasswordResetConfirmPage = () => {
  const [formData, setFormData] = useState({
    uid: "",
    token: "",
    new_password1: "",
    new_password2: "",
  });
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPasswordConfirm(formData.uid, formData.token, formData.new_password1, formData.new_password2);
      setFeedback("Password reset confirmed!");
      navigate("/accounts/login/");
    } catch (error) {
      setFeedback(error.detail || "Reset confirmation failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h2 className="text-3xl font-bold mb-4">Reset Password Confirmation</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input type="text" name="uid" placeholder="UID" required onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="token" placeholder="Token" required onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="password" name="new_password1" placeholder="New Password" required onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="password" name="new_password2" placeholder="Confirm New Password" required onChange={handleChange} className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Confirm Reset</button>
      </form>
      {feedback && <p className="mt-4 text-red-600">{feedback}</p>}
    </div>
  );
};

export default PasswordResetConfirmPage;
