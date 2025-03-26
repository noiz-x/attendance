// Frontend/src/components/Attendance.jsx
import React, { useState, useEffect } from "react";
import AttendanceService from "../services/attendanceService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Helper to format a Date in Africa/Lagos timezone to YYYY-MM-DD
const formatDate = (dateInput) => {
  const dateString = new Date(dateInput).toLocaleString("en-US", {
    timeZone: "Africa/Lagos",
  });
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

// Helper to get current time in Africa/Lagos as a Date object
const getNowInLagos = () =>
  new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" }));

// Parse a lecture's start and end times assuming Africa/Lagos (UTC+1)
const parseLectureTime = (lecture) => {
  const start = new Date(`${lecture.start_date}T${lecture.start_time}+01:00`);
  const end = new Date(`${lecture.start_date}T${lecture.end_time}+01:00`);
  return { start, end };
};

const Attendance = ({ selectedDate }) => {
  const [lectures, setLectures] = useState([]);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const formattedDate = formatDate(selectedDate);
        const response = await AttendanceService.listLectures({
          date: formattedDate,
        });
        setLectures(response.data.results || []);
      } catch (error) {
        console.error("Error fetching lectures:", error);
      }
    };

    fetchLectures();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          setErrorMessage(
            "Location permission is required to mark attendance."
          );
          setErrorModalOpen(true);
        }
      );
    }
  }, [selectedDate]);

  const isLectureActive = (lec) => {
    const now = getNowInLagos();
    const { start, end } = parseLectureTime(lec);
    return now >= start && now <= end;
  };

  const submitAttendance = async (lecture) => {
    if (!isLectureActive(lecture)) {
      setErrorMessage("Attendance cannot be marked at this time.");
      setErrorModalOpen(true);
      return;
    }

    try {
      await AttendanceService.recordAttendance({
        latitude: location.latitude,
        longitude: location.longitude,
        lecture_id: lecture.id,
      });
      setSuccessMessage("Your attendance has been marked.");
      setSuccessModalOpen(true);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Error marking attendance."
      );
      setErrorModalOpen(true);
    }
  };

  const renderLectureCard = (lec) => {
    const active = isLectureActive(lec);
    return (
      <Card key={lec.id} className="w-full bg-blue-50 p-6">
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            {`${lec.start_time} - ${lec.end_time}`}
          </CardTitle>
          <p className="text-md">
            Course: {`${lec.course?.course_code} - ${lec.course?.course_title}`}
          </p>
          <p className="text-md">
            Theatre: {lec.theatre?.name || `ID: ${lec.theatre}`}
          </p>
        </CardHeader>
        <CardContent>
          {active ? (
            <Button
              type="button"
              onClick={() => submitAttendance(lec)}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-blue-700"
            >
              Mark Attendance
            </Button>
          ) : (
            <Button
              disabled
              className="w-full bg-blue-500 text-white py-3 rounded-md"
            >
              Attendance Not Available Yet
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-xl font-bold mb-4">Attendance</h1>
      {lectures.length > 0 ? (
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          {lectures.map((lec) => renderLectureCard(lec))}
        </div>
      ) : (
        <p>No lectures available for the selected date.</p>
      )}

      <Dialog open={errorModalOpen} onOpenChange={setErrorModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription className="text-red-600">
              {errorMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setErrorModalOpen(false)}
              className="border border-black hover:bg-blue-300"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription className="text-green-600">
              {successMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setSuccessModalOpen(false)}
              className="border border-black hover:bg-blue-300"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Attendance;
