import Attendance from "./components/Attendance";
import Day from "./components/Day";
import Timetable from "./components/Timetable";

function App() {

  return (
    <div className="w-screen p-4 md:p-8">
      <Day/>
      <Attendance/>
      <Timetable/>
    </div>
  );
}

export default App;
