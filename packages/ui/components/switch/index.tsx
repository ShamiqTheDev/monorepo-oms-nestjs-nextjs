"use client";

import { forwardRef } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { styled, cx } from "@atdb/design-system";
import { switchRecipe } from "./index.recipe";

const BaseSwitch = forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>>(
  ({ className, ...props }, ref) => {
    const styles = switchRecipe();

    return (
      <SwitchPrimitive.Root className={cx("peer", styles.root, className)} {...props} ref={ref}>
        <SwitchPrimitive.Thumb className={styles.thumb} />
      </SwitchPrimitive.Root>
    );
  }
);
BaseSwitch.displayName = SwitchPrimitive.Root.displayName;

export const Switch = styled(BaseSwitch);
