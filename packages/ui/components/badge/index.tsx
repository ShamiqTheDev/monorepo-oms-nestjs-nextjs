import { styled, type HTMLStyledProps } from "@atdb/design-system";
import { badge } from "./index.recipe";

export const Badge = styled("div", badge);

export type BadgeProps = HTMLStyledProps<typeof Badge>;
