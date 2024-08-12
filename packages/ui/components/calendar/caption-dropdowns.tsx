import { addMonths } from "date-fns";

import { MonthsDropdown } from "./months-dropdown";
import { YearsDropdown } from "./years-dropdown";
import { CaptionLabel, useDayPicker, useNavigation, type CaptionProps, type MonthChangeEventHandler } from "react-day-picker";
import { styled } from "@atdb/design-system";

/**
 * Render a caption with the dropdowns to navigate between months and years.
 */
export function CaptionDropdowns(props: CaptionProps): JSX.Element {
  const { classNames } = useDayPicker();
  const { goToMonth } = useNavigation();

  const handleMonthChange: MonthChangeEventHandler = (newMonth) => {
    goToMonth(addMonths(newMonth, props.displayIndex ? -props.displayIndex : 0));
  };
  const captionLabel = <CaptionLabel id={props.id} displayMonth={props.displayMonth} />;
  return (
    <styled.div display={"flex"} justifyContent={"space-between"} gap="md" w="full" className={classNames.caption_dropdowns}>
      {/* Caption label is visually hidden but for a11y. */}
      <styled.div srOnly>{captionLabel}</styled.div>
      <MonthsDropdown onChange={handleMonthChange} displayMonth={props.displayMonth} />
      <YearsDropdown onChange={handleMonthChange} displayMonth={props.displayMonth} />
    </styled.div>
  );
}
