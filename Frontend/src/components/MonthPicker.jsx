import { useState, useRef } from "react";

export default function MonthPicker() {
  const [month, setMonth] = useState("");
  const inputRef = useRef(null);

  // When text is clicked, open the native month picker.
  const handlePickerClick = () => {
    if (inputRef.current && typeof inputRef.current.showPicker === "function") {
      inputRef.current.showPicker();
    } else {
      // Fallback: focus the input if showPicker isn't supported.
      inputRef.current.focus();
    }
  };

  // Update state when a new month is selected.
  const handleChange = (e) => {
    setMonth(e.target.value);
  };

  // Format the month for display; if no month is selected, show a default text.
  const displayText = month
    ? new Date(month + "-01").toLocaleString("default", {
        month: "long",
      })
    : "Select Month";

  return (
    <div className="relative inline-block">
      <p
        onClick={handlePickerClick}
        className="cursor-pointer text-gray-700 hover:text-blue-500"
      >
        {displayText}
      </p>
      {/* The input is absolutely positioned below the text.
          Its opacity and height are set so it doesn't interfere with the layout,
          yet its position is used for the native picker. */}
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
