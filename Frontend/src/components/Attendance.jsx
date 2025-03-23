// Frontend/src/components/Attendance.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import AttendanceService from "../services/attendanceService";

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
  // Sample lecture data; ideally this comes from your backend.
  const lectureData = {
    lectureTime: "10:00 - 11:00",
    lectureTheatre: "HSLT C",
    course: "MTH 201",
    lectureId: "1",
  };

  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [message, setMessage] = useState("");

  useEffect(() => {
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

  const submitAttendance = async () => {
    try {
      const response = await AttendanceService.recordAttendance({
        latitude: location.latitude,
        longitude: location.longitude,
        lecture_id: lectureData.lectureId,
      });
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
