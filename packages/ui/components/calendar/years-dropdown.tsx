
import { setYear, startOfMonth, startOfYear } from "date-fns";

import { useDayPicker, type MonthChangeEventHandler } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import { ScrollArea } from "../scroll-area";
import { useState } from "react";

/**
 * The props for the {@link YearsDropdown} component.
 */
export interface YearsDropdownProps {
  /** The month where the drop-down is displayed. */
  displayMonth: Date;
  /** Callback to handle the `change` event. */
  onChange: MonthChangeEventHandler;
}

/**
 * Render a dropdown to change the year. Take in account the `nav.fromDate` and
 * `toDate` from context.
 */
export function YearsDropdown(props: YearsDropdownProps): JSX.Element {
  const [val, setVal] = useState(props.displayMonth.getFullYear());
  const { displayMonth } = props;
  const {
    fromDate,
    toDate,
    locale,
    formatters: { formatYearCaption },
    labels: { labelYearDropdown },
  } = useDayPicker();

  const years: Date[] = [];

  // Dropdown should appear only when both from/toDate is set
  if (!fromDate) return <></>;
  if (!toDate) return <></>;

  const fromYear = fromDate.getFullYear();
  const toYear = toDate.getFullYear();
  for (let year = fromYear; year <= toYear; year++) {
    years.push(setYear(startOfYear(new Date()), year));
  }

  const handleChange = (selectedYear: number) => {
    const newMonth = setYear(startOfMonth(displayMonth), selectedYear);
    setVal(newMonth.getFullYear())
    props.onChange(newMonth);
  };

  return (
    <Select
      name="years"
      aria-label={labelYearDropdown()}
      onValueChange={handleChange}
      defaultValue={displayMonth.getFullYear()}
      caption={formatYearCaption(displayMonth, { locale })}
      value={val}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select Year" />
      </SelectTrigger>
      <SelectContent>
        <ScrollArea h="11xl">
          {years.map((year) => (
            <SelectItem key={year.getFullYear()} value={year.getFullYear()}>
              {formatYearCaption(year, { locale })}
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}
