import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AttendanceService from "../services/attendanceService"; // Using attendanceService for registrations

const Registration = () => {
  const [courses, setCourses] = useState([]);
  const [registered, setRegistered] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await AttendanceService.listRegistrations();
        setCourses(response.data.results || []);
      } catch (error) {
        console.error("Error fetching registrations:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleRegister = async (courseId) => {
    try {
      await AttendanceService.registerCourse({ course_id: courseId });
      setRegistered((prev) => ({ ...prev, [courseId]: true }));
      setMessage("Registration successful!");
    } catch (error) {
      setMessage("Registration failed. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-xl font-bold mb-4">Course Registration</h1>
      {message && <p className="text-green-600 mb-4">{message}</p>}
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
                disabled={registered[course.id]}
                onClick={() => handleRegister(course.id)}
                className={`mt-2 ${
                  registered[course.id]
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500"
                } text-white`}
              >
                {registered[course.id] ? "Registered" : "Register"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Registration;
