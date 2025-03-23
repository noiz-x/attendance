// Frontend/src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute component checks if the user is authenticated.
 * If not, it redirects to the login page.
 *
 * @param {Object} props - React props.
 * @param {React.ReactNode} props.children - The child components to render if authenticated.
 * @returns {React.ReactNode} The protected content or a redirect.
 */
const ProtectedRoute = ({ children }) => {
  // Check for the JWT token; adjust this logic based on your authentication setup.
  const token = localStorage.getItem("access_token");

  // If there's no token, redirect to login.
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Otherwise, render the child components.
  return children;
};

export default ProtectedRoute;
