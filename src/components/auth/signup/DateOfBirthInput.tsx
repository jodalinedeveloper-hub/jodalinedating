import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";

interface DateOfBirthInputProps {
  value?: Date;
  onChange: (date?: Date) => void;
}

export const DateOfBirthInput = ({ value, onChange }: DateOfBirthInputProps) => {
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value && value instanceof Date && !isNaN(value.getTime())) {
      setDay(String(value.getDate()).padStart(2, '0'));
      setMonth(String(value.getMonth() + 1).padStart(2, '0'));
      setYear(String(value.getFullYear()));
    } else {
      setDay("");
      setMonth("");
      setYear("");
    }
  }, [value]);

  const handleDateChange = (d: string, m: string, y: string) => {
    setDay(d);
    setMonth(m);
    setYear(y);

    if (d.length > 0 && m.length > 0 && y.length === 4) {
      const dayInt = parseInt(d, 10);
      const monthInt = parseInt(m, 10);
      const yearInt = parseInt(y, 10);

      if (!isNaN(dayInt) && !isNaN(monthInt) && !isNaN(yearInt) &&
          dayInt > 0 && dayInt <= 31 &&
          monthInt > 0 && monthInt <= 12 &&
          yearInt > 1900 && yearInt < new Date().getFullYear()) {
        
        const date = new Date(yearInt, monthInt - 1, dayInt);
        
        if (date.getFullYear() === yearInt && date.getMonth() === monthInt - 1 && date.getDate() === dayInt) {
          onChange(date);
        } else {
          onChange(undefined);
        }
      } else {
        onChange(undefined);
      }
    } else {
      onChange(undefined);
    }
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    handleDateChange(val, month, year);
    if (val.length === 2) {
      monthRef.current?.focus();
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    handleDateChange(day, val, year);
    if (val.length === 2) {
      yearRef.current?.focus();
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleDateChange(day, month, e.target.value);
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="DD"
        value={day}
        onChange={handleDayChange}
        maxLength={2}
        type="tel"
      />
      <Input
        ref={monthRef}
        placeholder="MM"
        value={month}
        onChange={handleMonthChange}
        maxLength={2}
        type="tel"
      />
      <Input
        ref={yearRef}
        placeholder="YYYY"
        value={year}
        onChange={handleYearChange}
        maxLength={4}
        type="tel"
      />
    </div>
  );
};