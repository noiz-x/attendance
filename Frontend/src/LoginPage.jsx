import React, { useState } from 'react';
import { loginUser, getUserDetails } from './api';

const LoginPage = ({ switchToRegister }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
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
      const loginData = await loginUser(formData.username, formData.password);
      const token = loginData.access || loginData.key;
      const userData = await getUserDetails(token);
      setUserDetails(userData);
      setFeedback('Login successful!');
    } catch (error) {
      setFeedback(error.detail || 'Login failed.');
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
            Seamless Login for Exclusive Access
          </h2>
          <p className="text-sm mt-6 text-slate-500 leading-relaxed">
            Immerse yourself in a hassle-free login journey with our intuitively designed login form.
          </p>
          <p className="text-sm mt-12 text-slate-500">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={switchToRegister}
              className="text-blue-600 font-medium hover:underline ml-1"
            >
              Register here
            </button>
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
                placeholder="Enter Username"
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
                placeholder="Enter Password"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-slate-500">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                  Forgot your password?
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <button
              type="submit"
              disabled={loading}
              className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
          <div className="my-4 flex items-center gap-4">
            <hr className="w-full border-slate-300" />
            <p className="text-sm text-slate-800 text-center">or</p>
            <hr className="w-full border-slate-300" />
          </div>
          <div className="space-x-6 flex justify-center">
            {/* Optional social login buttons */}
          </div>
          {feedback && <p className="mt-4 text-center text-red-600">{feedback}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
