// Frontend/src/components/Attendance.jsx

import React, { useState, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
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

const ErrorModal = ({ isOpen, onClose, errorMessage }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="bg-white">
      <DialogHeader>
        <DialogTitle>Error</DialogTitle>
        <DialogDescription className="text-red-600">{errorMessage}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button onClick={onClose} className="border border-black hover:bg-gray-300">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const LectureCard = ({
  lectureTime,
  lectureTheatre,
  course,
  lectureId,
  buttonText,
  buttonDisabled = false,
  onButtonClick,
  className = "",
}) => {
  return (
    <Card className={`w-full bg-neutral-50 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-bold">{lectureTime}</CardTitle>
        <p className="text-sm">{lectureTheatre}</p>
        {course && <p className="text-sm">{course}</p>}
        <input type="hidden" value={lectureId} />
      </CardHeader>
      <CardContent>
        <Button
          onClick={onButtonClick}
          disabled={buttonDisabled}
          className={`w-full py-3 rounded-md transition duration-300 ease-linear ${
            buttonDisabled
              ? "bg-neutral-500 text-white"
              : "bg-black hover:bg-gray-700 text-white"
          }`}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

const Attendance = () => {
  // Sample lecture data; ideally this comes from your backend.
  const lectureData = {
    lectureTime: "10:00 - 11:00",
    lectureTheatre: "HSLT C",
    course: "MTH 201",
    lectureId: 2,
  };

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [message, setMessage] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);

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
          let errMsg;
          if (error.code === 1) {
            // PERMISSION_DENIED is typically code 1
            errMsg = "Location permission is required to mark attendance.";
          } else {
            errMsg = `Error fetching location: ${error.message}`;
          }
          setMessage(errMsg);
          setErrorModalOpen(true);
        }
      );
    }
  }, []);

  const submitAttendance = async (e) => {
    e.preventDefault();

    // If location is not set, show error modal.
    if (location.latitude === null || location.longitude === null) {
      const errMsg = "Cannot submit attendance without location permission.";
      setMessage(errMsg);
      setErrorModalOpen(true);
      return;
    }

    try {
      const response = await AttendanceService.recordAttendance({
        latitude: location.latitude,
        longitude: location.longitude,
        lecture_id: lectureData.lectureId,
      });
      setMessage(response.data.message);
    } catch (error) {
      // Assuming error.request.response is a JSON string.
      const errorDetail = JSON.parse(error.request.response).detail;
      setMessage(errorDetail);
      setErrorModalOpen(true);
    }
  };

  return (
    <div>
      <h1 className="text-xl">Attendance</h1>
      <form className="mt-3" onSubmit={submitAttendance}>
        <ResizablePanelGroup direction="horizontal" className="sm:w-full gap-2">
          <ResizablePanel>
            <LectureCard
              {...lectureData}
              buttonText="Mark Attendance"
              onButtonClick={submitAttendance}
              className="p-6"
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel className="hidden md:block">
            <LectureCard
              {...lectureData}
              buttonText="Attendance"
              buttonDisabled={true}
              className="p-6"
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </form>
      <ErrorModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        errorMessage={message}
      />
    </div>
  );
};

export default Attendance;
