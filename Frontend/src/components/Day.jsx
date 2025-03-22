// Frontend/src/components/Day.jsx

import { useState } from "react";

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

const DayButton = ({ currentDate, offset, isCurrent, onSelect }) => {
  const date = new Date(currentDate);
  date.setDate(currentDate.getDate() + offset);
  const dayClass = isCurrent ? "currentDay" : "day";

  return (
    <button
      className={dayClass}
      onClick={isCurrent ? undefined : () => onSelect(date)}
    >
      <p className="lg:hidden">{daysShort[date.getDay()]}</p>
      <p className="hidden lg:inline">{daysLong[date.getDay()]}</p>
      <p className="text-xl md:text-xl">{date.getDate()}</p>
    </button>
  );
};

const Day = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helper function to change the current date.
  const changeDate = (date) => setCurrentDate(date);

  // Week navigation handlers.
  const shiftDate = (days) =>
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + days);
      return d;
    });

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
          className="rounded-md hidden cursor-pointer h-[100px] w-12 md:flex items-center justify-center bg-neutral-50"
          onClick={() => shiftDate(-7)}
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
          <DayButton
            currentDate={currentDate}
            offset={-2}
            onSelect={changeDate}
          />
          <DayButton
            currentDate={currentDate}
            offset={-1}
            onSelect={changeDate}
          />
          <DayButton
            currentDate={currentDate}
            offset={0}
            isCurrent
            onSelect={changeDate}
          />
          <DayButton
            currentDate={currentDate}
            offset={1}
            onSelect={changeDate}
          />
          <DayButton
            currentDate={currentDate}
            offset={2}
            onSelect={changeDate}
          />
        </div>

        {/* Next Week */}
        <button
          className="rounded-md hidden h-[100px] w-12 cursor-pointer md:flex items-center justify-center bg-neutral-50"
          onClick={() => shiftDate(7)}
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
        <button
          className="rounded-md cursor-pointer h-full w-1/2 flex items-center justify-center bg-neutral-50"
          onClick={() => shiftDate(-7)}
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
        <button
          className="rounded-md cursor-pointer h-full w-1/2 flex items-center justify-center bg-neutral-50"
          onClick={() => shiftDate(7)}
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
