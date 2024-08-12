/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { styled } from "@atdb/design-system";
import { createStyleContext } from "@shadow-panda/style-context";
import checkbox from "./index.recipe";

const { withProvider, withContext } = createStyleContext(checkbox);

export const Root = withProvider(styled("div"), "root");
export const Control = withProvider(styled("input"), "control");
export const Icon = withContext(styled("span"), "icon");
