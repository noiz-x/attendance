// Frontend/src/components/Day.jsx

import { useState } from "react";

const Day = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Arrays for day and month names.
  const daysShort = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const daysLong = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Helper function to add days to a Date object.
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  return (
    <div className="w-full flex flex-col items-center gap-3 md:gap-6 mb-8">
      {/* Static Month Display */}
      <div className="text-xl font-bold">
        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
      </div>

      {/* Day Picker */}
      <div className="flex h-[125px] items-center gap-2 md:gap-6 w-full">
        {/* Previous Week */}
        <button
          className="rounded-md hidden  cursor-pointer h-[100px] w-12 md:flex items-center justify-center bg-neutral-50"
          onClick={() => {
            setCurrentDate(addDays(currentDate, -7));
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        <div className="w-full flex items-center gap-3 md:gap-6">
          {/* 2 days before */}
          <button
            className="day"
            onClick={() => {
              setCurrentDate(addDays(currentDate, -2));
            }}
          >
            <p className="lg:hidden">
              {daysShort[addDays(currentDate, -2).getDay()]}
            </p>
            <p className="hidden lg:inline">
              {daysLong[addDays(currentDate, -2).getDay()]}
            </p>
            <p className="text-xl md:text-xl">
              {addDays(currentDate, -2).getDate()}
            </p>
          </button>

          {/* A Day before */}
          <button
            className="day"
            onClick={() => {
              setCurrentDate(addDays(currentDate, -1));
            }}
          >
            <p className="lg:hidden">
              {daysShort[addDays(currentDate, -1).getDay()]}
            </p>
            <p className="hidden lg:inline">
              {daysLong[addDays(currentDate, -1).getDay()]}
            </p>
            <p className="text-xl md:text-xl">
              {addDays(currentDate, -1).getDate()}
            </p>
          </button>

          {/* Current Day */}
          <button className="currentDay">
            <p className="lg:hidden">{daysShort[currentDate.getDay()]}</p>
            <p className="hidden lg:inline">{daysLong[currentDate.getDay()]}</p>
            <p className="text-xl md:text-xl">{currentDate.getDate()}</p>
          </button>

          {/* A Day After */}
          <button
            className="day"
            onClick={() => {
              setCurrentDate(addDays(currentDate, 1));
            }}
          >
            <p className="lg:hidden">
              {daysShort[addDays(currentDate, 1).getDay()]}
            </p>
            <p className="hidden lg:inline">
              {daysLong[addDays(currentDate, 1).getDay()]}
            </p>
            <p className="text-xl md:text-xl">
              {addDays(currentDate, 1).getDate()}
            </p>
          </button>

          {/* 2 Days After */}
          <button
            className="day"
            onClick={() => {
              setCurrentDate(addDays(currentDate, 2));
            }}
          >
            <p className="lg:hidden">
              {daysShort[addDays(currentDate, 2).getDay()]}
            </p>
            <p className="hidden lg:inline">
              {daysLong[addDays(currentDate, 2).getDay()]}
            </p>
            <p className="text-xl md:text-xl">
              {addDays(currentDate, 2).getDate()}
            </p>
          </button>
        </div>

        {/* Next Week */}
        <button
          className="rounded-md hidden h-[100px] w-12 cursor-pointer md:flex items-center justify-center bg-neutral-50"
          onClick={() => {
            setCurrentDate(addDays(currentDate, 7));
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Week Nav */}
      <div className="flex md:hidden h-12 w-full gap-4">
        {/* Previous Week */}
        <button
          className="rounded-md  cursor-pointer h-full w-1/2 flex items-center justify-center bg-neutral-50"
          onClick={() => {
            setCurrentDate(addDays(currentDate, -7));
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        {/* Next Week */}
        <button
          className="rounded-md cursor-pointer h-full w-1/2 flex items-center justify-center bg-neutral-50"
          onClick={() => {
            setCurrentDate(addDays(currentDate, 7));
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
      <p
        className="text-blue-500 cursor-pointer"
        onClick={() => setCurrentDate(new Date())}
      >
        Today
      </p>
    </div>
  );
};

export default Day;
