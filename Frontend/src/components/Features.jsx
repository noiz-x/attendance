// Frontend/src/components/Features.jsx

import React from 'react';

const featuresData = [
  {
    title: 'Online Courses',
    description: 'Learn anywhere, anytime with 24/7 access.',
    icon: '📚',
  },
  {
    title: 'Expert Trainers',
    description: 'Top instructors with real-world experience.',
    icon: '🎓',
  },
  {
    title: 'Get Certificate',
    description: 'Earn accredited certificates upon completion.',
    icon: '✅',
  },
  {
    title: 'Life Time Access',
    description: 'Revisit course materials whenever you need.',
    icon: '🔑',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          For Your Future Learning
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {featuresData.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 text-center bg-white rounded shadow hover:shadow-md transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-black text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
