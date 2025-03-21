import React, { useEffect, useState } from "react";
import { logoutUser } from "../api";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const [feedback, setFeedback] = useState("Logging out...");
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const doLogout = async () => {
      try {
        await logoutUser(token);
      } catch (error) {
        console.error("Logout error:", error);
      }
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setFeedback("Logged out successfully!");
      navigate("/accounts/login/");
    };
    doLogout();
  }, [navigate, token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <p>{feedback}</p>
    </div>
  );
};

export default LogoutPage;
