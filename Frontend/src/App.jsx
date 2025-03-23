import Date from "./componsnts/Date";
import Timetable from "./componsnts/Timetable";
import Attendance from "./componsnts/Attendance";

function App() {

  return (
    <div className="w-full p-8">
      <Date />
      <Attendance />
      <Timetable />
    </div>
  );
}

export default App;
