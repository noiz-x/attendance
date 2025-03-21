import React, { useState } from "react";
import { resendEmail } from "../api";

const ResendEmailPage = () => {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resendEmail(email);
      setFeedback("Verification email resent!");
    } catch (error) {
      setFeedback(error.detail || "Resend failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h2 className="text-3xl font-bold mb-4">Resend Verification Email</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input type="email" name="email" placeholder="Enter your email" required onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Resend Email</button>
      </form>
      {feedback && <p className="mt-4 text-red-600">{feedback}</p>}
    </div>
  );
};

export default ResendEmailPage;
