// Frontend/src/components/MonthPicker.jsx
import { useState, useRef } from "react";

export default function MonthPicker() {
  const [month, setMonth] = useState("");
  const inputRef = useRef(null);

  const handlePickerClick = () => {
    if (inputRef.current && typeof inputRef.current.showPicker === "function") {
      inputRef.current.showPicker();
    } else {
      inputRef.current.focus();
    }
  };

  const handleChange = (e) => {
    setMonth(e.target.value);
  };

  const displayText = month
    ? new Date(month + "-01").toLocaleString("default", { month: "long" })
    : "Select Month";

  return (
    <div className="relative inline-block">
      <p
        onClick={handlePickerClick}
        className="cursor-pointer text-gray-700 hover:text-blue-500"
      >
        {displayText}
      </p>
      <input
        ref={inputRef}
        type="month"
        value={month}
        onChange={handleChange}
        className="absolute top-full left-0 opacity-0 w-full h-0"
      />
    </div>
  );
}
