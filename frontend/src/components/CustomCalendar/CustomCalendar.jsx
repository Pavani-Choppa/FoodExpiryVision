import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./CustomCalendar.module.css";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const CustomCalendar = ({ value, onChange }) => {
  const initialDate = value
    ? new Date(
        Number(value.split("-")[0]),
        Number(value.split("-")[1]) - 1,
        Number(value.split("-")[2])
      )
    : new Date();
  
  const [currentDate, setCurrentDate] = useState(initialDate);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSelect = (day) => {
    const selected = new Date(year, month, day);

    // ✅ LOCAL date (no UTC shift)
    const formatted = selected.toLocaleDateString("en-CA"); // YYYY-MM-DD

    onChange(formatted);
  };

  const renderDays = () => {
    const cells = [];

    // Previous month filler
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      cells.push(
        <span key={`prev-${i}`} className={styles.muted}>
          {daysInPrevMonth - i}
        </span>
      );
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const isSelected =
        value &&
        Number(value.split("-")[2]) === d &&
        Number(value.split("-")[1]) - 1 === month &&
        Number(value.split("-")[0]) === year;

      cells.push(
        <button
          key={d}
          className={`${styles.day} ${isSelected ? styles.selected : ""}`}
          onClick={() => handleSelect(d)}
        >
          {d}
        </button>
      );
    }

    return cells;
  };

  return (
    <div className={styles.calendar}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={handlePrevMonth}>
          <ChevronLeft size={18} />
        </button>

        <h4>
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h4>

        <button onClick={handleNextMonth}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Weekdays */}
      <div className={styles.weekdays}>
        {DAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* Days grid */}
      <div className={styles.grid}>{renderDays()}</div>
    </div>
  );
};

export default CustomCalendar;
