import React, { useState, useEffect } from "react";
import { getUserDetails } from "../api";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [feedback, setFeedback] = useState("");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserDetails(token);
        setUser(data);
      } catch (error) {
        setFeedback(error.detail || "Failed to fetch user details.");
      }
    };
    fetchUser();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      {user ? (
        <>
          <h2 className="text-3xl font-bold mb-4">Welcome, {user.username}</h2>
          <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(user, null, 2)}</pre>
        </>
      ) : (
        <p>{feedback || "Loading user details..."}</p>
      )}
    </div>
  );
};

export default UserPage;
