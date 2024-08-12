"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  DayPicker,
  type DayPickerDefaultProps,
  type DayPickerSingleProps,
  type DayPickerMultipleProps,
  type DayPickerRangeProps,
  CaptionNavigation,
  DayPickerBase,
} from "react-day-picker";
import { styled, cx, icon, VStack } from "@atdb/design-system";
import { button } from "../button/index.recipe";
import { calendar } from "./index.recipe";
import { CaptionDropdowns } from "./caption-dropdowns";

type DayPickerProps = DayPickerDefaultProps | DayPickerSingleProps | DayPickerMultipleProps | DayPickerRangeProps | DayPickerBase;

function BaseCalendar({ className, classNames, showOutsideDays = true, ...props }: DayPickerProps) {
  const { root, nav_button: navButton, day, ...rest } = calendar();
  return (
    <DayPicker
      className={cx(root, className)}
      captionLayout="dropdown-buttons"
      classNames={{
        ...rest,
        nav_button: cx(button({ variant: "outline" }), navButton),
        day: cx(button({ variant: "ghost" }), day),
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className={icon()} />,
        IconRight: () => <ChevronRight className={icon()} />,
        Caption: (props) => (
          <VStack>
            <CaptionDropdowns {...props} />
            <CaptionNavigation {...props} />
          </VStack>
        ),
      }}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  );
}
BaseCalendar.displayName = "Calendar";

export const Calendar = styled(BaseCalendar);
export type CalendarProps = React.ComponentProps<typeof Calendar>;
