// Frontend/src/components/Lecture.jsx

import React from "react";

const LectureCard = ({ lectureTime, lectureTheatre }) => (
  <div className="flex flex-col h-[100px] bg-neutral-100 rounded-md p-4">
    <p className="font-bold">{lectureTime}</p>
    <p className="text-xl">{lectureTheatre}</p>
  </div>
);

const Lecture = () => {
  const lectures = [
    { lectureTime: "13:00 - 14:00", lectureTheatre: "EEE 251 @ ODLT 1" },
    { lectureTime: "14:00 - 15:00", lectureTheatre: "EEE 252 @ ODLT 2" },
    { lectureTime: "15:00 - 16:00", lectureTheatre: "EEE 253 @ ODLT 3" },
    { lectureTime: "16:00 - 17:00", lectureTheatre: "EEE 254 @ ODLT 4" },
    { lectureTime: "17:00 - 18:00", lectureTheatre: "EEE 255 @ ODLT 5" },
    { lectureTime: "18:00 - 19:00", lectureTheatre: "EEE 256 @ ODLT 6" },
    { lectureTime: "19:00 - 20:00", lectureTheatre: "EEE 257 @ ODLT 7" },
  ];

  return (
    <div className="mt-8">
      <h1 className="text-xl">Lecture</h1>
      <div className="mt-4 w-full gap-4 grid grid-cols-1 md:grid-cols-3">
        {lectures.map((lecture, index) => (
          <LectureCard key={index} {...lecture} />
        ))}
      </div>
    </div>
  );
};

export default Lecture;
