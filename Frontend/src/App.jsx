import Day from "../src/components/Day";
import Timetable from "../src/components/Timetable";
import Attendance from "../src/components/Attendance";

function App() {

  return (
    <div className="w-full p-8">
      <Day />
      <Attendance />
      <Timetable />
    </div>
  );
}

export default App;
