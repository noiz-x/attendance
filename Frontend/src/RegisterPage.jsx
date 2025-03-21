import React, { useState } from 'react';
import { registerUser, getUserDetails } from './api';

const RegisterPage = ({ switchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    setLoading(true);
    try {
      const registrationData = await registerUser(
        formData.username,
        formData.email,
        formData.password1,
        formData.password2
      );
      const token = registrationData.access || registrationData.key;
      const userData = await getUserDetails(token);
      setUserDetails(userData);
      setFeedback('Registration successful!');
    } catch (error) {
      setFeedback(error.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  if (userDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center py-6 px-4 bg-gray-50">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Welcome, {userDetails.username}</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(userDetails, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4 bg-gray-50">
      <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl max-md:max-w-md w-full">
        <div>
          <h2 className="lg:text-5xl text-3xl font-bold lg:leading-[57px] text-slate-900">
            Join Us for Exclusive Access
          </h2>
          <p className="text-sm mt-6 text-slate-500 leading-relaxed">
            Create your account quickly and effortlessly.
          </p>
          <p className="text-sm mt-12 text-slate-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={switchToLogin}
              className="text-blue-600 font-medium hover:underline ml-1"
            >
              Sign in here
            </button>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md md:ml-auto w-full">
          <h3 className="text-slate-900 lg:text-3xl text-2xl font-bold mb-8">Register</h3>
          <div className="space-y-6">
            <div>
              <label className="text-sm text-slate-800 font-medium mb-2 block">Username</label>
              <input
                name="username"
                type="text"
                required
                onChange={handleChange}
                className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-blue-600 focus:bg-transparent"
                placeholder="Enter Username"
              />
            </div>
            <div>
              <label className="text-sm text-slate-800 font-medium mb-2 block">Email</label>
              <input
                name="email"
                type="email"
                required
                onChange={handleChange}
                className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-blue-600 focus:bg-transparent"
                placeholder="Enter Email"
              />
            </div>
            <div>
              <label className="text-sm text-slate-800 font-medium mb-2 block">Password</label>
              <input
                name="password1"
                type="password"
                required
                onChange={handleChange}
                className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-blue-600 focus:bg-transparent"
                placeholder="Enter Password"
              />
            </div>
            <div>
              <label className="text-sm text-slate-800 font-medium mb-2 block">Confirm Password</label>
              <input
                name="password2"
                type="password"
                required
                onChange={handleChange}
                className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-blue-600 focus:bg-transparent"
                placeholder="Confirm Password"
              />
            </div>
          </div>
          <div className="mt-12">
            <button
              type="submit"
              disabled={loading}
              className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
          {feedback && <p className="mt-4 text-center text-red-600">{feedback}</p>}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
