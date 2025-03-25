// Frontend/src/components/Day.jsx

import { ArrowLeft, ArrowRight } from "lucide-react";

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

  let dayClass;

  switch (offset) {
    case 0:
      dayClass = "currentDay";
      break;
    case -1:
      dayClass = "day1";
      break;
    case 1:
      dayClass = "day1";
      break;
    case -2:
      dayClass = "day2";
      break;
    case 2:
      dayClass = "day2";
      break;
    default:
      dayClass = "";
  }

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

const Day = ({ selectedDate, setSelectedDate }) => {
  // Use selectedDate from props or default to new Date() if not provided
  const currentDate = selectedDate || new Date();

  const changeDate = (date) => setSelectedDate(date);
  const shiftDate = (days) =>
    setSelectedDate((prev) => {
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
      <div className="text-xl font-bold">
        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
      </div>
      <div className="flex h-[125px] items-center gap-2 md:gap-6 w-full">
        <button
          className="border border-neutral-400 rounded-md hidden cursor-pointer h-[50px] w-12 md:flex items-center justify-center bg-neutral-50"
          onClick={() => shiftDate(-7)}
        >
          <ArrowLeft size={24} />
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
        <button
          className="border border-neutral-400 rounded-md hidden h-[50px] w-12 cursor-pointer md:flex items-center justify-center bg-neutral-50"
          onClick={() => shiftDate(7)}
        >
          <ArrowRight size={24} />
        </button>
      </div>
      <div className="flex md:hidden h-12 w-full gap-4">
        <button
          className="border border-neutral-50 rounded-md cursor-pointer h-full w-1/2 flex items-center justify-center bg-neutral-50"
          onClick={() => shiftDate(-7)}
        >
          <ArrowLeft size={24} />
        </button>
        <button
          className="border border-neutral-50 rounded-md cursor-pointer h-full w-1/2 flex items-center justify-center bg-neutral-50"
          onClick={() => shiftDate(7)}
        >
          <ArrowRight size={24} />
        </button>
      </div>
      <p
        className="text-blue-500 cursor-pointer"
        onClick={() => setSelectedDate(new Date())}
      >
        Today
      </p>
    </div>
  );
};

export default Day;