"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { createStyleContext } from "@shadow-panda/style-context";
import { styled } from "@atdb/design-system";
import popover from "./index.recipe";

const { withProvider, withContext } = createStyleContext(popover);

const Portal = withContext(styled(PopoverPrimitive.Portal), "portal");

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    portal?: boolean;
  }
>(({ align = "center", portal, sideOffset = 4, onOpenAutoFocus = (e: Event) => e.preventDefault(), ...props }, ref) =>
  portal ? (
    <Portal>
      <PopoverPrimitive.Content ref={ref} align={align} sideOffset={sideOffset} onOpenAutoFocus={onOpenAutoFocus} {...props} />
    </Portal>
  ) : (
    <PopoverPrimitive.Content ref={ref} align={align} sideOffset={sideOffset} onOpenAutoFocus={onOpenAutoFocus} {...props} />
  )
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export const Root = withProvider(styled(PopoverPrimitive.Root), "root");
export const Trigger = withContext(styled(PopoverPrimitive.Trigger), "trigger");
export const Anchor = withContext(styled(PopoverPrimitive.Anchor), "anchor");
export const Close = withContext(styled(PopoverPrimitive.Close), "close");
export const Content = withContext(styled(PopoverContent), "content");
