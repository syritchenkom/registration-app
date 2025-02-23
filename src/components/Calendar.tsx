import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";

const API_URL = "https://api.api-ninjas.com/v1/holidays";
const API_KEY = "8DX8eEe67njS1lbThFsdSw==rQQNpQ8PYbPZBjrx";

interface HolidayType {
  date: string;
  type: string;
  name: string;
}

interface CalendarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange }) => {
  const [holidays, setHolidays] = useState<HolidayType[]>([]);
  const [message, setMessage] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(API_URL, {
        params: { country: "PL", year: 2024 },
        headers: { "X-Api-Key": API_KEY },
      })
      .then((res) => setHolidays(res.data))
      .catch((err) => console.error("Error fetching holidays:", err));
  }, []);

  // const isDateDisabled = (date: string) => {
  //   const parsedDate = new Date(date);
  //   const formattedDate = format(parsedDate, "yyyy-MM-dd");
  //   const holiday = holidays.find((h) => h.date === formattedDate);
  //   return holiday?.type === "NATIONAL_HOLIDAY" || parsedDate.getDay() === 0;
  // };

  const handleMonthChange = (direction: "prev" | "next") => {
    setCurrentMonth((prev) =>
      direction === "prev" ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const handleDateClick = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    onDateChange(formattedDate);
    const holiday = holidays.find((h) => h.date === formattedDate);
    setMessage(holiday?.type === "OBSERVANCE" ? `Info: ${holiday.name}` : "");
  };

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Generate dates for the current month and display in a grid
  const datesArray = Array.from({ length: 42 }, (_, index) => {
    const startOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const firstDayOfMonth = startOfMonth.getDay();
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      index - firstDayOfMonth + 1
    );
    return date;
  });

  const isInCurrentMonth = (date: Date) => isSameMonth(date, currentMonth);
  const isSelected = (date: Date) => isSameDay(date, new Date(selectedDate));

  return (
    <div className="w-full flex flex-col md:flex-row gap-4">
      {/* Calendar */}
      <div>
        <h3>Date</h3>
        <div className="w-full w-[343px] md:w-[326px] rounded border border-[#CBB6E5] bg-white p-4">
          {/* Header with month navigation */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => handleMonthChange("prev")}
              className="p-1 rounded hover:bg-gray-100"
            >
              &lt;
            </button>
            <div className="font-semibold">
              {format(currentMonth, "MMMM yyyy")}
            </div>
            <button
              onClick={() => handleMonthChange("next")}
              className="p-1 rounded hover:bg-gray-100"
            >
              &gt;
            </button>
          </div>

          {/* Week days */}
          <div className="grid grid-cols-7 text-center font-medium mb-2">
            {weekDays.map((dayName) => (
              <div key={dayName}>{dayName}</div>
            ))}
          </div>

          {/* Date grid */}
          <div className="grid grid-cols-7 text-center gap-y-2">
            {datesArray.map((day) => {
              const isInCurrentMonthDay = isInCurrentMonth(day);
              const isSelectedDay = selectedDate && isSelected(day);

              return (
                <div
                  key={day.getTime()}
                  className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full cursor-pointer
                ${
                  !isInCurrentMonthDay
                    ? "text-gray-400"
                    : isSelectedDay
                    ? "bg-purple-500 text-white"
                    : "hover:bg-purple-100"
                }`}
                  onClick={() => isInCurrentMonthDay && handleDateClick(day)}
                >
                  {format(day, "d")}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time selection section */}
      {selectedDate && (
        <div className="w-[76px] sm:w-[342px]">
          <h3>Time</h3>
          <div>
            <div className="flex flex-row sm:flex-wrap gap-2">
              {["12:00", "14:00", "16:30", "18:30", "20:00"].map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeClick(time)}
                  className={`px-4 py-2 text-center w-[80px] rounded border
                ${
                  selectedTime === time
                    ? "bg-white text-black border-2 border-[#761BE4]"
                    : "bg-white text-black border-[#CBB6E5] hover:bg-purple-100"
                }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
