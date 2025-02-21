"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { createStyleContext } from "@shadow-panda/style-context";
import { styled } from "@atdb/design-system";
import { tabs } from "./index.recipe";

const { withProvider, withContext } = createStyleContext(tabs);

export const Tabs = withProvider(styled(TabsPrimitive.Root), "root");
export const TabsList = withContext(styled(TabsPrimitive.List), "list");
export const TabsTrigger = withContext(styled(TabsPrimitive.Trigger), "trigger");
export const TabsContent = withContext(styled(TabsPrimitive.Content), "content");
