// src/components/Layout.jsx
import React from "react";
import { Link } from "react-router-dom";

const Layout = ({ children, heading = "Vista Charter Public Schools" }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <nav className="flex items-center justify-between px-6 py-4 bg-black text-white">
        <div className="text-xl font-bold">
          <Link to="/">VISTA CHARTER PUBLIC SCHOOLS</Link>
        </div>
        <div className="space-x-6 hidden md:block">
          <Link to="#" className="hover:underline">DONATE</Link>
          <Link to="#" className="hover:underline">ENROLL</Link>
          <Link to="#" className="hover:underline">MENU</Link>
        </div>
        {/* Simple mobile menu icon */}
        <div className="md:hidden">
          <button className="focus:outline-none">
            <span className="material-icons">menu</span>
          </button>
        </div>
      </nav>

      {/* Hero Section with background image */}
      <div
        className="relative bg-cover bg-center bg-no-repeat flex-grow flex items-center justify-center text-center"
        style={{ backgroundImage: "url('/assets/hero-bg.jpg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Hero Text */}
        <div className="relative z-10 text-white px-4 py-16 max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">{heading}</h1>
          <p className="text-base sm:text-lg">
            Empowering Students Through High‐Quality Education
          </p>
        </div>
      </div>

      {/* Page Content Container */}
      <div className="bg-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
