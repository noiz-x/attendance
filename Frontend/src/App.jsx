// Frontend/src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Day from "./components/Day";
import Attendance from "./components/Attendance";
import Timetable from "./components/Timetable";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Route for main content */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {/* Default styling is kept consistent with Day, Attendance and Timetable */}
              <div className="w-screen p-4 md:p-8">
                <Day />
                <Attendance />
                <Timetable />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
