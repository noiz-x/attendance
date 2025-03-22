import React from "react";

const Attendance = () => {
  return (
    <>
      <h1 className="text-xl">Attendance</h1>
      <form action="" className="flex gap-4 mt-3">
        {/* Current Class */}
        <div className="flex w-full md:w-1/2 p-6 gap-4 md:gap-[40%] items-center bg-neutral-50">
          <div className="w-full flex flex-col">
            <h1 id="lectureTime" className="text-lg  font-bold">
              10:00 - 11:00
            </h1>
            <p id="lectureTheatre" className="text-sm ">
              HSLT C
            </p>
            <p id="course" className="text-sm ">
              MTH 201
            </p>
            <input type="hidden" id="lectureId" value="lecture_id" />
          </div>
          <button
            type="submit"
            className="cursor-pointer bg-black hover:bg-blue-500 text-white py-3 px-auto w-full rounded-md h-fit transition duration-300 ease-linear"
          >
            Attendance
          </button>
        </div>

        {/* Next Lecture */}
        <div className="hidden md:flex w-1/2 p-2 md-p-6 gap-4 md:gap-[40%] items-center md:w-[50%] bg-neutral-50">
          <div className="w-full flex flex-col   p-4">
            <h1 id="lectureTime" className="text-lg  font-bold">
              10:00 - 11:00
            </h1>
            <p id="lectureTheatre" className="text-sm ">
              HSLT C
            </p>
            <p id="course" className="text-sm ">
              MTH 201
            </p>
            <input type="hidden" id="lectureId" value="lecture_id" />
          </div>
          <button
            className="cursor-pointer bg-neutral-500 text-white py-3 px-auto w-full rounded-md h-fit "
            disabled
          >
            Attendance
          </button>
        </div>
      </form>
    </>
  );
};

export default Attendance;
