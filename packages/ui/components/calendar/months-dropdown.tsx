
import { isSameYear, setMonth, startOfMonth } from "date-fns";

import { useDayPicker, type MonthChangeEventHandler } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import { ScrollArea } from "../scroll-area";
import { useState } from "react";

/** The props for the {@link MonthsDropdown} component. */
export interface MonthsDropdownProps {
  /** The month where the dropdown is displayed. */
  displayMonth: Date;
  onChange: MonthChangeEventHandler;
}

/** Render the dropdown to navigate between months. */
export function MonthsDropdown(props: MonthsDropdownProps): JSX.Element {
  const [val, setVal] = useState(props.displayMonth.getMonth());
  
  const {
    fromDate,
    toDate,
    locale,
    formatters: { formatMonthCaption },
    classNames,
    labels: { labelMonthDropdown },
  } = useDayPicker();

  // Dropdown should appear only when both from/toDate is set
  if (!fromDate) return <></>;
  if (!toDate) return <></>;

  const dropdownMonths: Date[] = [];

  if (isSameYear(fromDate, toDate)) {
    // only display the months included in the range
    const date = startOfMonth(fromDate);
    for (let month = fromDate.getMonth(); month <= toDate.getMonth(); month++) {
      dropdownMonths.push(setMonth(date, month));
    }
  } else {
    // display all the 12 months
    const date = startOfMonth(new Date()); // Any date should be OK, as we just need the year
    for (let month = 0; month <= 11; month++) {
      dropdownMonths.push(setMonth(date, month));
    }
  }

  const handleChange = (selectedMonth: number) => {
    const newMonth = setMonth(startOfMonth(props.displayMonth), selectedMonth);
    setVal(newMonth.getMonth());
    props.onChange(newMonth);
  };

  return (
    <Select
      name="months"
      aria-label={labelMonthDropdown()}
      className={classNames.dropdown_month}
      onValueChange={handleChange}
      defaultValue={props.displayMonth.getMonth()}
      caption={formatMonthCaption(props.displayMonth, { locale })}
      value={val}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select Month"  />
      </SelectTrigger>
      <SelectContent>
        <ScrollArea h="11xl">
          {dropdownMonths.map((m) => (
            <SelectItem key={m.getMonth()} value={m.getMonth()}>
              {formatMonthCaption(m, { locale })}
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}
