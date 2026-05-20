import { cn } from "@/src/lib/utils";
import { CalendarDays } from "lucide-react";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { DateRange } from "react-day-picker";
import { Button } from "./button";

// A simple helper function to generate the days of the month
const generateDays = (year: number, month: number): (number | null)[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday, etc.

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  return days;
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface Props {
  selected?: DateRange | Date;
  // onSelect now handles either a DateRange or a single Date
  onSelect: Dispatch<SetStateAction<DateRange | undefined>>;
  fromYear?: number;
  toYear?: number;
  // setDateHandler is now optional and will be used for 'single' mode
  setDateHandler?: (selected: Date | undefined) => void;
  resetDateHandler?: () => void;
  disabled?: (date: Date) => boolean;
  mode?: "single" | "range";
}

const DateRangePicker: React.FC<Props> = ({
  toYear = new Date().getFullYear() + 50,
  fromYear = new Date().getFullYear() - 50,
  selected,
  onSelect,
  setDateHandler,
  resetDateHandler,
  disabled,
  mode = "range",
}) => {
  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => fromYear + i
  );

  // The 'from' and 'to' properties are only relevant for range mode.
  // We'll cast 'selected' to DateRange to access them, or use a default object.
  const { to, from } =
    mode === "range" && selected
      ? (selected as DateRange)
      : {
          to: undefined,
          from: undefined,
        };
  const singleDate = (mode === "single" && (selected as Date)) ?? undefined;

  const [currentDate, setCurrentDate] = useState<Date>(
    singleDate || from || new Date()
  );
  const [showMonthYearPicker, setShowMonthYearPicker] =
    useState<boolean>(false);

  const monthScrollRef = useRef<HTMLDivElement>(null);
  const yearScrollRef = useRef<HTMLDivElement>(null);

  const days = generateDays(currentDate.getFullYear(), currentDate.getMonth());
  const paddingDays = days.filter((day) => day === null).length;
  const currentYear = currentDate.getFullYear();

  // Effect to scroll to the selected month and year
  useEffect(() => {
    if (showMonthYearPicker && monthScrollRef.current) {
      const selectedMonthButton =
        monthScrollRef.current.querySelector(".selected-month");
      if (selectedMonthButton) {
        selectedMonthButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
    if (showMonthYearPicker && yearScrollRef.current) {
      const selectedYearButton =
        yearScrollRef.current.querySelector(".selected-year");
      if (selectedYearButton) {
        selectedYearButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [showMonthYearPicker, currentDate]);

  const handleDayClick = (day: number | null) => {
    if (day === null) return;
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    if (disabled && disabled(selectedDate)) return;

    // Logic for single date mode
    if (mode === "single") {
      onSelect(selectedDate as unknown as DateRange);
      return;
    }

    //  Logic for range mode
    if (!from) {
      onSelect({ from: selectedDate, to: undefined });
    } else if (!to && selectedDate > from) {
      onSelect({ from, to: selectedDate });
    } else {
      onSelect({ from: selectedDate, to: undefined });
    }
  };

  const handleMonthYearPickerClick = () => {
    setShowMonthYearPicker(!showMonthYearPicker);
  };

  const handleMonthClick = (monthIndex: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex));
  };

  const handleYearClick = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth()));
  };

  const handlePrevMonthYear = () => {
    if (showMonthYearPicker) {
      const currentYearIndex = years.indexOf(currentYear);
      if (currentYearIndex > 0) {
        setCurrentDate(
          new Date(years[currentYearIndex - 1], currentDate.getMonth())
        );
      }
    } else {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
      );
    }
  };

  const handleNextMonthYear = () => {
    if (showMonthYearPicker) {
      const currentYearIndex = years.indexOf(currentYear);
      if (currentYearIndex < years.length - 1) {
        setCurrentDate(
          new Date(years[currentYearIndex + 1], currentDate.getMonth())
        );
      }
    } else {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
      );
    }
  };

  const formatDate = (date?: Date): string =>
    date ? date.toLocaleDateString() : "";

  const isSelected = (day: number | null): boolean => {
    if (day === null) return false;
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
      23,
      59,
      59,
      0
    );

    // Logic for single date selection
    if (mode === "single" && singleDate) {
      return (
        date.getTime() ===
        new Date(singleDate.setHours(23, 59, 59, 0)).getTime()
      );
    }

    // Logic for range selection
    if (from && to) {
      return (
        date >= new Date(from.setHours(0, 0, 0, 0)) &&
        date <= new Date(to.setHours(23, 59, 59, 0))
      );
    }
    return !!(
      (from &&
        date.getTime() === new Date(from.setHours(23, 59, 59, 0)).getTime()) ||
      (to && date.getTime() === new Date(to.setHours(23, 59, 59, 0)).getTime())
    );
  };

  const scrollMonths = (direction: "left" | "right") => {
    if (monthScrollRef.current) {
      const scrollAmount = direction === "left" ? -100 : 100;
      monthScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollYears = (direction: "left" | "right") => {
    if (yearScrollRef.current) {
      const scrollAmount = direction === "left" ? -100 : 100;
      yearScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="flex rounded-[11px] bg-white shadow-[0_1px_9.3px_0_rgba(0, 0, 0, 0.10)]"
      style={{
        width: mode === "single" ? "324px" : "502px",
        minHeight: "363px",
      }}
    >
      {/* Left section for date inputs and sort button, rendered only in range mode */}
      {mode === "range" && (
        <div
          className="flex flex-col shrink-0 border-r-[0.5px] border-neutral-strokes bg-surface-subtle px-4 pb-4 pt-6 text-[12px]"
          style={{ width: "178px" }}
        >
          <div className="flex grow flex-col gap-3 py-3.75">
            {[
              "All Time",
              "Today",
              "Last 7 Days",
              "Last 30 Days",
              "Custom Range",
            ].map((option) => (
              <label
                key={option}
                className="flex items-center gap-2.5 cursor-pointer text-sm text-grey-text font-medium"
              >
                <input
                  type="radio"
                  name="dateFilter"
                  value={option}
                  className="accent-primary w-3.75 h-3.75"
                />
                {option}
              </label>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {resetDateHandler && (
              <Button size="sm" onClick={resetDateHandler}>
                Reset
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={() => setDateHandler && setDateHandler(selected as Date)}
              className="bg-brand-green/30 h-10"
            >
              Sort
            </Button>
          </div>
        </div>
      )}

      {/* Right section for calendar/picker */}
      <div className="grow p-6">
        <div className="flex items-center gap-2 mb-3.75 text-xs">
          <div
            className={cn({
              "flex items-center gap-1.5 rounded-md border-[0.4px] border-gray-300 p-2.5": true,
              "border-neutral-strokes": !from,
            })}
          >
            <CalendarDays
              className="h-4 w-4 text-neutral-input-text"
              strokeWidth={1.3}
            />
            <input
              type="text"
              placeholder="Start date"
              readOnly
              value={formatDate(from)}
              className="w-full placeholder-grey-text focus:outline-none"
            />
          </div>
          <span className="w-4.5 h-4.5 text-neutral-strokes">→</span>
          <div
            className={cn({
              "flex items-center gap-1.5 rounded-md border-[0.4px] border-gray-300 p-2.5": true,
              "border-neutral-strokes": from && !to,
            })}
          >
            <CalendarDays
              className="h-4 w-4 text-neutral-input-text"
              strokeWidth={1.3}
            />
            <input
              type="text"
              placeholder="End date"
              readOnly
              value={formatDate(to)}
              className="w-full placeholder-grey-text focus:outline-none"
            />
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <button
            className="flex items-center gap-2 text-lg font-semibold"
            onClick={handleMonthYearPickerClick}
          >
            {months[currentDate.getMonth()]} {currentYear}
            {showMonthYearPicker ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>
          {!showMonthYearPicker && (
            <div className="flex space-x-2">
              <button
                onClick={handlePrevMonthYear}
                className="rounded-full p-2 hover:bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={handleNextMonthYear}
                className="rounded-full p-2 hover:bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {showMonthYearPicker ? (
          <>
            <div className="flex max-w-72.5 flex-col space-y-4 overflow-auto">
              {/* Month navigation and display */}
              <div className="flex items-center justify-between">
                <span>Month</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => scrollMonths("left")}
                    className="rounded-full p-1 hover:bg-gray-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => scrollMonths("right")}
                    className="rounded-full p-1 hover:bg-gray-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div
                ref={monthScrollRef}
                className="scrollbar-hide flex space-x-2 overflow-x-auto pb-2"
              >
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleMonthClick(index)}
                    className={`whitespace-nowrap rounded-md border px-2.5 py-2 text-[12px] font-medium ${
                      currentDate.getMonth() === index
                        ? "selected-month border-primary bg-error-subtle"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>

              {/* Year navigation and display */}
              <div className="mt-2 flex items-center justify-between">
                <span>Year</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => scrollYears("left")}
                    className="rounded-full p-1 hover:bg-gray-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => scrollYears("right")}
                    className="rounded-full p-1 hover:bg-gray-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div
                ref={yearScrollRef}
                className="scrollbar-hide flex space-x-2 overflow-x-auto pb-2"
              >
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearClick(year)}
                    className={`whitespace-nowrap rounded-md border px-2.5 py-2 text-[12px] font-medium ${
                      currentYear === year
                        ? "selected-year border-primary bg-error-subtle"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-3 grid grid-cols-7 gap-2 text-center text-[12px]">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <span key={day} className="font-medium text-gray-500">
                  {day}
                </span>
              ))}
              {Array.from({ length: paddingDays }, (_, i) => (
                <div key={i}></div>
              ))}
              {days.map((day, index) => {
                if (day === null) return null;
                const currentDay = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day
                );

                return (
                  <button
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={cn({
                      "rounded-full p-2 font-medium": true,
                      "hover:bg-primary/30": day,
                      "bg-primary text-white": isSelected(day),
                      invisible: !day,
                      "cursor-not-allowed text-gray-400 hover:bg-transparent":
                        disabled && disabled(currentDay),
                    })}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            {mode === "single" && (
              <div className="flex w-full gap-1.5">
                {resetDateHandler && (
                  <Button
                    size="sm"
                    onClick={resetDateHandler}
                    className="h-10 grow"
                  >
                    Reset
                  </Button>
                )}
                {setDateHandler && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setDateHandler(selected as Date)}
                    className="h-10 grow"
                  >
                    Sort
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;
