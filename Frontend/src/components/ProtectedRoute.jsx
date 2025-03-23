// Frontend/src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute component ensures that only authenticated users can access the children.
 * It checks for a JWT token in localStorage; if not found, it redirects to the login page.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
