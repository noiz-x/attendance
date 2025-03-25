import React, { useState, useEffect } from "react";
import AttendanceService from "../services/attendanceService";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
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
import moment from "moment-timezone";

const formatDate = (date) =>
  moment(date).tz("Africa/Lagos").format("YYYY-MM-DD");


const Attendance = ({ selectedDate }) => {
  const [lecture, setLecture] = useState(null);
  const [nextLecture, setNextLecture] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const response = await AttendanceService.listLectures({
          date: formatDate(selectedDate),
        });
        const lectures = response.data.results;
        const today = new Date();

        if (formatDate(selectedDate) === formatDate(today)) {
          const now = new Date();
          const ongoingLecture = lectures.find((lec) => {
            const startTime = new Date(`${lec.start_date}T${lec.start_time}`);
            const endTime = new Date(`${lec.end_date}T${lec.end_time}`);
            return now >= startTime && now <= endTime;
          });
          const upcomingLecture = lectures.find((lec) => {
            const startTime = new Date(`${lec.start_date}T${lec.start_time}`);
            return now < startTime;
          });
          setLecture(ongoingLecture);
          setNextLecture(!ongoingLecture ? upcomingLecture : null);
        } else {
          setLecture(lectures.length > 0 ? lectures[0] : null);
          setNextLecture(null);
        }
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
        (error) => {
          setErrorMessage("Location permission is required to mark attendance.");
          setErrorModalOpen(true);
        }
      );
    }
  }, [selectedDate]);

  const submitAttendance = async () => {
    if (!lecture) {
      setErrorMessage("No active lecture at this time.");
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
      setErrorMessage(error.response.data.error);
      setErrorModalOpen(true);
    }
  };

  return (
    <div>
      <h1 className="text-xl">Attendance</h1>
      {lecture ? (
        <ResizablePanelGroup direction="horizontal" className="sm:w-full gap-2">
          <ResizablePanel>
            <Card className="w-full bg-neutral-50 p-6">
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  {`${lecture.start_time} - ${lecture.end_time}`}
                </CardTitle>
                <p className="text-sm">Theatre ID: {lecture.theatre}</p>
                <p className="text-sm">Course ID: {lecture.course}</p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={submitAttendance}
                  className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-700"
                >
                  Mark Attendance
                </Button>
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : nextLecture ? (
        <ResizablePanelGroup direction="horizontal" className="sm:w-full gap-2">
          <ResizablePanel>
            <Card className="w-full bg-neutral-50 p-6">
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  {`${nextLecture.start_time} - ${nextLecture.end_time}`}
                </CardTitle>
                <p className="text-sm">Theatre ID: {nextLecture.theatre}</p>
                <p className="text-sm">Course ID: {nextLecture.course}</p>
              </CardHeader>
              <CardContent>
                <Button
                  disabled
                  className="w-full bg-neutral-500 text-white py-3 rounded-md"
                >
                  Attendance Not Available Yet
                </Button>
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <p>No ongoing or upcoming lectures at this time.</p>
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
              className="border border-black hover:bg-gray-300"
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
              className="border border-black hover:bg-gray-300"
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
