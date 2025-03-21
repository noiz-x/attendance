import React, { useState } from "react";
import { tokenRefresh } from "../api";
import { useNavigate } from "react-router-dom";

const TokenRefreshPage = () => {
  const [refresh, setRefresh] = useState("");
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await tokenRefresh(refresh);
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      setFeedback("Token refreshed!");
      navigate("/accounts/user/");
    } catch (error) {
      setFeedback(error.detail || "Token refresh failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h2 className="text-3xl font-bold mb-4">Refresh Token</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="text"
          name="refresh"
          placeholder="Enter Refresh Token"
          value={refresh}
          onChange={(e) => setRefresh(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Refresh Token</button>
      </form>
      {feedback && <p className="mt-4 text-red-600">{feedback}</p>}
    </div>
  );
};

export default TokenRefreshPage;
