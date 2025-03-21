import React, { useState, useEffect } from "react";
import { getAttendance } from "../api";

const AttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [feedback, setFeedback] = useState("");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const data = await getAttendance(token);
        setAttendance(data);
      } catch (error) {
        console.error("Attendance fetch error:", JSON.parse(error.request.response).error);
        setFeedback(JSON.parse(error.request.response).error || "Failed to fetch attendance.");
      }
    };
    fetchAttendance();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h2 className="text-3xl font-bold mb-4">Attendance Records</h2>
      {attendance.length > 0 ? (
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(attendance, null, 2)}</pre>
      ) : (
        <p>{feedback || "No attendance records found."}</p>
      )}
    </div>
  );
};

export default AttendancePage;
