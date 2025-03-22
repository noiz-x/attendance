// Frontend/src/components/Attendance.jsx

import React from "react";

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
    lectureId: "lecture_id",
  };

  return (
    <>
      <h1 className="text-xl">Attendance</h1>
      <form className="flex gap-4 mt-3">
        {/* Current Class */}
        <LectureCard
          {...lectureData}
          buttonText="Attendance"
          containerClasses="flex w-full md:w-1/2 p-6 gap-4 md:gap-[40%] items-center bg-neutral-50"
          buttonClasses="cursor-pointer bg-black hover:bg-blue-500 text-white py-3 px-auto w-full rounded-md h-fit transition duration-300 ease-linear"
        />

        {/* Next Lecture */}
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
