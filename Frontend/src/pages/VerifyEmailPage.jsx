import React, { useState } from "react";
import { verifyEmail } from "../api";
import { useSearchParams, useNavigate } from "react-router-dom";

const VerifyEmailPage = () => {
  const [key, setKey] = useState("");
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // If the URL includes a verification key, pre-populate it
  React.useEffect(() => {
    const keyParam = searchParams.get("key");
    if (keyParam) {
      setKey(keyParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyEmail(key);
      setFeedback("Email verified!");
      navigate("/accounts/login/");
    } catch (error) {
      setFeedback(error.detail || "Verification failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h2 className="text-3xl font-bold mb-4">Verify Email</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="text"
          name="key"
          placeholder="Verification Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Verify Email</button>
      </form>
      {feedback && <p className="mt-4 text-red-600">{feedback}</p>}
    </div>
  );
};

export default VerifyEmailPage;
