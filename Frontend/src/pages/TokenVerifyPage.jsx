import React, { useState } from "react";
import { tokenVerify } from "../api";

const TokenVerifyPage = () => {
  const [token, setToken] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tokenVerify(token);
      setFeedback("Token is valid!");
    } catch (error) {
      setFeedback(error.detail || "Token is invalid.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h2 className="text-3xl font-bold mb-4">Verify Token</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="text"
          name="token"
          placeholder="Enter Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Verify Token</button>
      </form>
      {feedback && <p className="mt-4 text-red-600">{feedback}</p>}
    </div>
  );
};

export default TokenVerifyPage;
