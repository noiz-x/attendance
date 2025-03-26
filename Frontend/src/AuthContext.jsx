// Frontend/src/AuthContext.jsx

import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  token: null,
  setToken: () => {},
});

export const AuthProvider = ({ children }) => {
  // Initialize token from localStorage.
  const [token, setToken] = useState(localStorage.getItem("access") || null);

  // Update localStorage whenever token changes.
  useEffect(() => {
    if (token) {
      localStorage.setItem("access", token);
    } else {
      localStorage.removeItem("access");
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
