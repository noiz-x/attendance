// Frontend/src/components/Footer.jsx

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white text-black py-6">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} E-Portal. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
