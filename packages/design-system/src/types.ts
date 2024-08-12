import { Theme, UtilityConfig } from "@pandacss/types";

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Extendable<T extends Record<any, any>> = T | { extend?: DeepPartial<T> };

export const defineTheme = <T extends Theme>(definition: Extendable<T>) => definition;

export const defineUtilities = <T extends UtilityConfig>(definition: Extendable<T>) => definition;
