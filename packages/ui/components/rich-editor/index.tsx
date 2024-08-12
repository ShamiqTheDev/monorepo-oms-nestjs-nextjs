"use client";

import { PropsWithChildren, forwardRef, useMemo, useRef, useState } from "react";
import { Plate, PlateContent, TElement, useMarkToolbarButton, useMarkToolbarButtonState } from "@udecode/plate-common";
import { MARK_BOLD, MARK_CODE, MARK_ITALIC, MARK_UNDERLINE } from "@udecode/plate-basic-marks";
import { css } from "@atdb/design-system";
import { Button } from "../button";
import { BoldIcon, CodeIcon, ItalicIcon, UnderlineIcon } from "lucide-react";
import { plugins } from "./content";

const PlateToolbarButton = forwardRef(({ nodeType, ...props }: PropsWithChildren<{ nodeType: string }>, ref) => {
  const state = useMarkToolbarButtonState({ nodeType });
  const { props: markProps } = useMarkToolbarButton(state);

  return (
    <Button
      {...{ ...props, ...markProps }}
      ref={ref}
      type="button"
      variant="ghost"
      bg={state.pressed ? "gray.100" : "transparent"}
      p="sm"
      border="1px solid token(colors.gray.300)"
      borderRadius={"3px"}
      w="2rem"
      h="2rem"
    />
  );
});

const PlateToolbar = () => {
  return (
    <div
      className={css({
        bg: "gray.50",
        p: "sm",
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        w: "full",
        border: "1px solid token(colors.gray.300)",
        borderRadius: "6px",
      })}
    >
      <PlateToolbarButton nodeType={MARK_BOLD}>
        <BoldIcon className={css({ w: "1rem", h: "1rem" })} />
      </PlateToolbarButton>
      <PlateToolbarButton nodeType={MARK_ITALIC}>
        <ItalicIcon className={css({ w: "1rem", h: "1rem" })} />
      </PlateToolbarButton>
      <PlateToolbarButton nodeType={MARK_UNDERLINE}>
        <UnderlineIcon className={css({ w: "1rem", h: "1rem" })} />
      </PlateToolbarButton>
      <PlateToolbarButton nodeType={MARK_CODE}>
        <CodeIcon className={css({ w: "1rem", h: "1rem" })} />
      </PlateToolbarButton>
    </div>
  );
};

interface PlateEditorProps {
  value: TElement[];
  onChange: (value: string) => void;
}

export const PlateEditor = forwardRef(({ value: defaultValue, onChange, ...props }: PlateEditorProps, ref) => {
  const containerRef = useRef(null);
  const value = useMemo(() => JSON.parse(defaultValue as unknown as string), [defaultValue]);

  return (
    <Plate
      plugins={plugins}
      initialValue={value.length > 0 ? value : undefined}
      onChange={(value) => {
        const content = JSON.stringify(value);
        onChange(content);
      }}
    >
      <div ref={containerRef} className={css({ pos: "relative" })}>
        <PlateToolbar />
        <PlateContent
          {...props}
          ref={ref}
          placeholder=""
          className={css({
            p: "sm",
            border: "1px solid token(colors.gray.300)",
            borderRadius: "6px",
            marginTop: "sm",
            height: "8rem",
            overflow: "auto",
          })}
        />
      </div>
    </Plate>
  );
});

export { plugins };
