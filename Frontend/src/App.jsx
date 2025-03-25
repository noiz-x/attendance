// Frontend/src/App.jsx

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Day from "./components/Day";
import Attendance from "./components/Attendance";
import Lecture from "./components/Lecture";
import Login from "./components/Login";
import Signup from "./components/Signup";

const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="p-4 md:p-8">
                <Navbar />
                {/* Pass state to children */}
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
      </Routes>
    </Router>
  );
};

export default App;
