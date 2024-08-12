import { styled, type HTMLStyledProps } from "@atdb/design-system";
import { label } from "./index.recipe";

export const Label = styled("label", label);
export type LabelProps = HTMLStyledProps<typeof Label>;
