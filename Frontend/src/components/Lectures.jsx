// Frontend/src/components/Lectures.jsx
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AttendanceService from "../services/attendanceService"; // Using AttendanceService instead of lectureService
import { useParams } from "react-router-dom";

const Lectures = () => {
  const { courseId } = useParams();
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        // Filter lectures by course (assuming your backend supports this query)
        const response = await AttendanceService.listLectures({
          course: courseId,
        });
        setLectures(response.data.results || []);
      } catch (error) {
        console.error("Error fetching lectures:", error);
      }
    };

    fetchLectures();
  }, [courseId]);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-xl font-bold mb-4">Lectures</h1>
      {lectures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lectures.map((lec) => (
            <Card key={lec.id} className="bg-blue-50 p-4">
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  {lec.start_time} - {lec.end_time}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">
                  Course: {lec.course?.course_code} - {lec.course?.course_title}
                </p>
                <p className="mb-2">
                  Theatre: {lec.theatre?.name || `ID: ${lec.theatre}`}
                </p>
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
                  Mark Attendance
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>No lectures available for this course.</p>
      )}
    </div>
  );
};

export default Lectures;
