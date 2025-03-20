// AttendancePage.jsx
import React, { useState } from 'react';
import "./App.css";

const AttendancePage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    lecture: '', // assume lecture is selected by its ID
  });
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to simulate user login and return student_id.
  // Replace this with your actual API call.
  const loginUser = async (username, password) => {
    console.log({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username, password}),
      })
    try {
      const response = await fetch('https://imago.serveo.net/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username, password }),
      });
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      const data = await response.json();
      // Assuming response returns { student_id: <id> }
      return data.student_id;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Function to record attendance
  const recordAttendance = async (student_id, lecture, latitude, longitude) => {
    try {
      const response = await fetch('https://imago.serveo.net/api/attendance/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lecture_id: lecture,
          student_id: student_id,
          latitude: latitude,
          longitude: longitude,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Attendance failed');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    setLoading(true);
    try {
      // Authenticate user to get student_id
      const student_id = await loginUser(formData.username, formData.password);

      // Request location permission
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser.');
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Call attendance API
          const attendanceData = await recordAttendance(student_id, formData.lecture, latitude, longitude);
          setFeedback(attendanceData.message || 'Attendance recorded successfully.');
          setLoading(false);
        },
        (error) => {
          setLoading(false);
          setFeedback('Error obtaining location: ' + error.message);
        }
      );
    } catch (error) {
      setFeedback(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-lg max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Attendance Login</h2>
        {feedback && (
          <div className={`p-4 mb-4 rounded ${feedback.toLowerCase().includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {feedback}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Your username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {/* Lecture Selection */}
          <div>
            <label htmlFor="lecture" className="block text-sm font-medium text-gray-700">Lecture</label>
            <select
              name="lecture"
              id="lecture"
              value={formData.lecture}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a lecture</option>
              <option value="1">Lecture 1</option>
              <option value="2">Lecture 2</option>
              <option value="3">Lecture 3</option>
              {/* Add more lectures as needed */}
            </select>
          </div>
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {loading ? 'Processing...' : 'Record Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendancePage;
