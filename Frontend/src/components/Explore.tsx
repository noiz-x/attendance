// Frontend/src/components/Explore.jsx

const Explore = () => {
  return (
    <div className="flex min-h-screen items-center justify-center gap-2 dark:bg-gray-800 bg-green-700 text-white py-0 flex-col max-w-7xl mx-auto md:flex-row px-4">
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
  );
};

export default Explore;
