"use client";

import { createStyleContext } from "@shadow-panda/style-context";
import { cx, styled } from "@atdb/design-system";
import { cardsList } from "./index.recipe";
import React from "react";

const { withProvider, withContext } = createStyleContext(cardsList);

export type AsChildProps<DefaultElementProps> = ({ asChild?: false } & DefaultElementProps) | { asChild: true; children: React.ReactNode };

function Slot({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
}) {
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ...children.props,
      style: {
        ...props.style,
        ...children.props.style,
      },
      className: cx(props.className, children.props.className),
    });
  }
  if (React.Children.count(children) > 1) {
    React.Children.only(null);
  }
  return null;
}

const CardsListBase = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & AsChildProps<React.HTMLAttributes<HTMLElement>>>(
  ({ asChild, children, ...props }, ref) => {
    if (asChild) return <Slot {...props}>{children}</Slot>;
    return (
      <styled.ol {...props} ref={ref}>
        {children}
      </styled.ol>
    );
  }
);

export const CardsList = withProvider(styled(CardsListBase), "root");
export const CardItem = withContext(styled("li"), "item");
export const CardIcon = withContext(styled("span"), "item_icon");
export const CardBody = withContext(styled("div"), "item_body");
export const CardBodyTime = withContext(styled("time"), "item_body_time");
export const CardBodyContent = withContext(styled("div"), "item_body_content");
