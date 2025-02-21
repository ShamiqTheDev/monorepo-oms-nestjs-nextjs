"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { styled, cx } from "@atdb/design-system";
import { checkbox } from "./index.recipe";

const BaseCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
  const styles = checkbox();

  return (
    <CheckboxPrimitive.Root ref={ref} className={cx("peer", styles.root, className)} {...props}>
      <CheckboxPrimitive.Indicator className={styles.indicator}>
        <Check size={12} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
BaseCheckbox.displayName = CheckboxPrimitive.Root.displayName;

export const Checkbox = styled(BaseCheckbox);
