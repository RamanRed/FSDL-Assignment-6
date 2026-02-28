import { useMemo } from "react";

const formatLocalDate = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const buildWeek = () => {
  const dates = [];
  const base = new Date();

  for (let i = 0; i < 7; i += 1) {
    const day = new Date(base);
    day.setDate(base.getDate() + i);
    dates.push(formatLocalDate(day));
  }

  return dates;
};

function CalendarStrip({ selectedDate, onDateChange }) {
  const weekDates = useMemo(buildWeek, []);

  return (
    <div className="calendar-strip">
      {weekDates.map((date) => {
        const label = new Date(date).toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short"
        });

        const active = date === selectedDate;

        return (
          <button
            key={date}
            type="button"
            className={`date-chip ${active ? "active" : ""}`}
            onClick={() => onDateChange(date)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default CalendarStrip;