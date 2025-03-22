// Frontend/src/components/Hero.jsx

import React from 'react';

const Hero = () => {
  return (
    <section
      id="home"
      className="bg-green-700 text-white py-16 flex flex-col justify-center"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-4">
        {/* Left text content */}
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            For Every Student, <br className="hidden md:block" />
            Every Classroom.
          </h1>
          <p className="mb-6 text-gray-100">
            Access thousands of online classes from the world’s top instructors. 
            Learn anytime, anywhere, at your own pace.
          </p>
          <button className="bg-white text-green-700 px-6 py-3 rounded font-semibold hover:bg-gray-100">
            Get Started
          </button>
        </div>
        {/* Right image / illustration */}
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          {/* Placeholder for the beanbag-laptop image */}
          <img
            src="../../public/samurai_champloo.jpg"
            alt="Student"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
