// Frontend/src/components/Course.jsx
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AttendanceService from "../services/attendanceService"; // Reusing AttendanceService
import { useNavigate } from "react-router-dom";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await AttendanceService.listCourses();
        setCourses(response.data.results || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-xl font-bold mb-4">Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card key={course.id} className="bg-blue-50 p-4">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                {course.course_code} - {course.course_title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{course.description}</p>
              <Button
                className="bg-indigo-600 hover:bg-indigo-500 text-white"
                onClick={() => navigate(`/courses/${course.id}/lectures`)}
              >
                View Lectures
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Course;
