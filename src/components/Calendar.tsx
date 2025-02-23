import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";

const API_URL = "https://api-ninjas.com/api/holidays";
const API_KEY = "OH+HEf/9IH2zuHR/cMO/8g==ldhBovC6Rpa1TIss";

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

  const isDateDisabled = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const holiday = holidays.find((h) => h.date === formattedDate);
    return (
      date.getDay() === 0 || (holiday && holiday?.type === "NATIONAL_HOLIDAY")
    );
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    setCurrentMonth((prev) =>
      direction === "prev" ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return; // blocked date handling
    const formattedDate = format(date, "yyyy-MM-dd");
    onDateChange(formattedDate);
    const holiday = holidays.find((h) => h.date === formattedDate);
    if (holiday && holiday.type === "OBSERVANCE") {
      setMessage(`Info: ${holiday.name}`);
    } else {
      setMessage("");
    }
  };

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
  };

  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const adjustedDay =
    firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay();
  const startDate = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1 - (adjustedDay - 1)
  );

  // Generate dates for the current month and display in a grid
  const datesArray = Array.from({ length: 42 }, (_, index) => {
    return new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + index
    );
  });

  const isInCurrentMonth = (date: Date) => isSameMonth(date, currentMonth);
  const isSelected = (date: Date) =>
    selectedDate && isSameDay(date, new Date(selectedDate));

  return (
    <div className="w-full mb-[48px] flex flex-col md:flex-row gap-4">
      {/* Calendar */}
      <div>
        <h3>Date</h3>
        <div className="w-full w-[343px] md:w-[326px] rounded border border-[#CBB6E5] bg-white p-4">
          {/* Header with month navigation */}
          <div className="flex justify-around items-center mb-4">
            <button
              onClick={() => handleMonthChange("prev")}
              className="p-1 rounded hover:bg-gray-100 cursor-pointer"
            >
              <svg
                width="11"
                height="14"
                viewBox="0 0 11 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.499999 7.86602C-0.166668 7.48112 -0.166667 6.51888 0.5 6.13397L9.5 0.937821C10.1667 0.552921 11 1.03405 11 1.80385L11 12.1962C11 12.966 10.1667 13.4471 9.5 13.0622L0.499999 7.86602Z"
                  fill="#CBB6E5"
                />
              </svg>
            </button>
            <div className="font-semibold">
              {format(currentMonth, "MMMM yyyy")}
            </div>
            <button
              onClick={() => handleMonthChange("next")}
              className="p-1 rounded hover:bg-gray-100 cursor-pointer"
            >
              <svg
                width="11"
                height="14"
                viewBox="0 0 11 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.5 7.86602C11.1667 7.48112 11.1667 6.51888 10.5 6.13397L1.5 0.937821C0.833334 0.552921 6.10471e-07 1.03405 5.76822e-07 1.80385L1.2256e-07 12.1962C8.8911e-08 12.966 0.833333 13.4471 1.5 13.0622L10.5 7.86602Z"
                  fill="#CBB6E5"
                />
              </svg>
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
              const isSelectedDay = isSelected(day);
              const disabled = isDateDisabled(day);

              return (
                <div
                  key={day.getTime()}
                  className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full cursor-pointer
                ${
                  !isInCurrentMonthDay
                    ? "text-gray-400"
                    : disabled
                    ? "text-[#898DA9] cursor-none"
                    : isSelectedDay
                    ? "bg-purple-500 text-white"
                    : "hover:bg-purple-100"
                }`}
                  onClick={() =>
                    isInCurrentMonthDay && !disabled && handleDateClick(day)
                  }
                >
                  {format(day, "d")}
                </div>
              );
            })}
          </div>
        </div>
        {message && (
          <div className="mt-2 p-2 bg-blue-100 text-blue-700 rounded">
            {message}
          </div>
        )}
      </div>

      {/* Time selection section */}
      {selectedDate && (
        <div className="sm:w-[342px] lg:w-[426px]">
          <h3>Time</h3>
          <div>
            <div className="flex flex-wrap justify-between gap-2">
              {["12:00", "14:00", "16:30", "18:30", "20:00"].map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeClick(time)}
                  className={`px-4 py-2 text-center rounded border w-[76px] sm:w-auto
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
