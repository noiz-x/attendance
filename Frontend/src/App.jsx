// Frontend/src/App.jsx

import React, { useState } from 'react';
import "./App.css";
import { loginUser, recordAttendance } from './api';

const AttendancePage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    lecture: '',
  });
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    setLoading(true);
    try {
      // Authenticate and get tokens
      const { access } = await loginUser(formData.username, formData.password);

      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser.');
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const attendanceData = await recordAttendance(access, formData.lecture, latitude, longitude);
          setFeedback(attendanceData.message || 'Attendance recorded successfully.');
          setLoading(false);
        },
        (error) => {
          setLoading(false);
          setFeedback('Error obtaining location: ' + error.message);
        }
      );
    } catch (error) {
      setFeedback(error.detail || error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
      <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl max-md:max-w-md w-full">
        <div>
          <h2 className="lg:text-5xl text-3xl font-bold lg:leading-[57px] text-slate-900">
            Seamless Login for Exclusive Access
          </h2>
          <p className="text-sm mt-6 text-slate-500 leading-relaxed">
            Immerse yourself in a hassle-free login journey with our intuitively designed login form.
          </p>
          <p className="text-sm mt-12 text-slate-500">
            Don't have an account? <a href="#" className="text-blue-600 font-medium hover:underline ml-1">Register here</a>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md md:ml-auto w-full">
          <h3 className="text-slate-900 lg:text-3xl text-2xl font-bold mb-8">Sign in</h3>
          <div className="space-y-6">
            <div>
              <label className="text-sm text-slate-800 font-medium mb-2 block">Username</label>
              <input 
                name="username" 
                type="text" 
                required 
                onChange={handleChange}
                className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-blue-600 focus:bg-transparent" 
                placeholder="Enter username" 
              />
            </div>
            <div>
              <label className="text-sm text-slate-800 font-medium mb-2 block">Password</label>
              <input 
                name="password" 
                type="password" 
                required 
                onChange={handleChange}
                className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-blue-600 focus:bg-transparent" 
                placeholder="Enter password" 
              />
            </div>
            <div>
              <label className="text-sm text-slate-800 font-medium mb-2 block">Lecture ID</label>
              <input 
                name="lecture" 
                type="text" 
                required 
                onChange={handleChange}
                className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-blue-600 focus:bg-transparent" 
                placeholder="Enter Lecture ID" 
              />
            </div>
          </div>

          <div className="mt-12">
            <button type="submit" className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
              {loading ? 'Processing...' : 'Log in'}
            </button>
          </div>

          {feedback && (
            <div className="mt-4 text-center text-sm text-red-600">
              {feedback}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AttendancePage;
