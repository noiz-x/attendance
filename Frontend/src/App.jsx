// Frontend/src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Day from "./components/Day";
import Attendance from "./components/Attendance";
import Lecture from "./components/Lecture";
import Course from "./components/Course"; // Newly created
import Lectures from "./components/Lectures"; // Newly created
import Registration from "./components/Registration"; // Newly created
import Login from "./components/Login";
import Signup from "./components/Signup";

const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="p-4 md:p-8">
                <Navbar />
                <Day
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
                <Attendance selectedDate={selectedDate} />
                <Lecture selectedDate={selectedDate} />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <div className="p-4 md:p-8">
                <Navbar />
                <Course />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/:courseId/lectures"
          element={
            <ProtectedRoute>
              <div className="p-4 md:p-8">
                <Navbar />
                <Lectures />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/registration"
          element={
            <ProtectedRoute>
              <div className="p-4 md:p-8">
                <Navbar />
                <Registration />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <div className="p-4 md:p-8">
                <Navbar />
                <h1 className="text-xl">Page not found</h1>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
