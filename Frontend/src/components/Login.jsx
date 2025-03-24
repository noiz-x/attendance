// Frontend/src/components/Login.jsx

import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AccountService from "../services/accountService";
import { AuthContext } from "../AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Set initial loading state to false
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await AccountService.login({ username, password });
      // Assuming token is in response.data.access
      setToken(response.data.access);
      navigate("/");
    } catch (error) {
      // Extract non_field_errors from the error response if they exist
      const nonFieldErrors = error.response?.data?.non_field_errors;
      setError(nonFieldErrors || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1 font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div class="flex items-center justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 mt-4 text-white rounded-md transition duration-300 ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <div class="flex items-center justify-center m-[10px]">
                <div
                  class={`${
                    loading &&
                    "h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white border-4"
                  }`}
                ></div>
                <div class="ml-2">{loading ? "Processing..." : "Login"}</div>
              </div>
            </button>
          </div>
        </form>
        <p className="text-center">
          Don't have an account?&nbsp;&nbsp;
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
