import { styled, type HTMLStyledProps } from "@atdb/design-system";
import { input } from "./index.recipe";

export const NativeInput = styled("input", input);
export type NativeInputProps = HTMLStyledProps<typeof NativeInput>;
