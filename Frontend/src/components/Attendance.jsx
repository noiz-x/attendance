// Frontend/src/components/Attendance.jsx
import React, { useState } from "react";
import axios from "axios";

// Sample LectureCard component remains unchanged
const LectureCard = ({
  lectureTime,
  lectureTheatre,
  course,
  lectureId,
  buttonText,
  buttonDisabled = false,
  containerClasses,
  buttonClasses,
  onButtonClick,
}) => {
  return (
    <div className={containerClasses}>
      <div className="w-full flex flex-col">
        <h1 className="text-lg font-bold">{lectureTime}</h1>
        <p className="text-sm">{lectureTheatre}</p>
        {course && <p className="text-sm">{course}</p>}
        <input type="hidden" value={lectureId} />
      </div>
      <button
        type="submit"
        className={buttonClasses}
        disabled={buttonDisabled}
        onClick={onButtonClick}
      >
        {buttonText}
      </button>
    </div>
  );
};

const Attendance = () => {
  // Sample static lecture data; adjust as needed.
  const lectureData = {
    lectureTime: "10:00 - 11:00",
    lectureTheatre: "HSLT C",
    course: "MTH 201",
    lectureId: "1", // Replace with actual lecture id from backend
  };

  // Example state for user location
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [message, setMessage] = useState("");

  // Fetch the user's geolocation when the component mounts
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  }, []);

  // Function to submit attendance to the backend
  const submitAttendance = async () => {
    // Replace with your actual API endpoint
    const apiUrl = "http://127.0.0.1:8000/api/attendance/";

    // You should retrieve your JWT token from localStorage or context if using authentication
    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.post(
        apiUrl,
        {
          latitude: location.latitude,
          longitude: location.longitude,
          lecture_id: lectureData.lectureId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error("Attendance submission error:", error);
      setMessage("Error submitting attendance.");
    }
  };

  return (
    <>
      <h1 className="text-xl">Attendance</h1>
      {message && <p className="text-center my-4">{message}</p>}
      <form className="flex gap-4 mt-3">
        {/* Current Lecture Attendance Card */}
        <LectureCard
          {...lectureData}
          buttonText="Mark Attendance"
          containerClasses="flex w-full md:w-1/2 p-6 gap-4 md:gap-[40%] items-center bg-neutral-50"
          buttonClasses="cursor-pointer bg-black hover:bg-blue-500 text-white py-3 px-auto w-full rounded-md h-fit transition duration-300 ease-linear"
          onButtonClick={(e) => {
            e.preventDefault();
            submitAttendance();
          }}
        />
        {/* Next Lecture (example disabled button) */}
        <LectureCard
          {...lectureData}
          buttonText="Attendance"
          buttonDisabled={true}
          containerClasses="hidden md:flex w-1/2 p-2 md:p-6 gap-4 md:gap-[40%] items-center bg-neutral-50"
          buttonClasses="cursor-pointer bg-neutral-500 text-white py-3 px-auto w-full rounded-md h-fit"
        />
      </form>
    </>
  );
};

export default Attendance;
