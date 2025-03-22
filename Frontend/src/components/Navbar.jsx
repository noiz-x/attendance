// Frontend/src/components/Navbar.jsx

import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-gray-800">
          <a href="">
            Attendance
          </a>
        </div>
        <div>
          <ul className="hidden md:flex space-x-6">
            <li><a href="#home" className="text-green-800 hover:text-green-600">Home</a></li>
            <li><a href="#features" className="text-green-800 hover:text-green-600">Features</a></li>
            <li><a href="#explore" className="text-green-800 hover:text-green-600">Explore</a></li>
            <li><a href="#about" className="text-green-800 hover:text-green-600">About</a></li>
          </ul>
        </div>
        <div className="hidden md:block grid-cols-2 space-x-4">
          <button className="text-green-600 px-4 py-2 rounded border border-green-500 hover:bg-green-600 hover:text-white">
            Login
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-white hover:text-green-600 hover:border-green-600 border">
            Sign Up
          </button>
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button type="button">
            <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
