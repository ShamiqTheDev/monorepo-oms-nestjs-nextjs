"use client";

import { css } from "@atdb/design-system";
import { Check } from "lucide-react";
import { Key, SetStateAction, useState } from "react";
import { Command, CommandEmpty, CommandInput, CommandItem, SelectComponent } from "../command";
import { Popover, ScrollArea } from "../..";

interface ComboBoxProps<T> {
  value: (option: T) => string;
  _key: (option: T) => Key;
  onSelect: (option: T) => void;
  selectedOption: (option: T) => boolean;
  placeholder: string;
  options: T[];
}

export function ComboBox<T>({ options, placeholder, selectedOption, _key: key, value, onSelect }: ComboBoxProps<T>) {
  return (
    <Command>
      <CommandInput placeholder={placeholder} />
      <CommandEmpty>No users found.</CommandEmpty>
      <SelectComponent>
        <ScrollArea h="full">
          {options.map((option) => (
            <CommandItem value={value(option)} key={key(option)} onSelect={() => onSelect(option)}>
              <Check className={css({ w: "xl", h: "auto" })} opacity={selectedOption(option) ? "1" : "0"} />
              {value(option)}
            </CommandItem>
          ))}
        </ScrollArea>
      </SelectComponent>
    </Command>
  );
}

export function FullComboBox<T>({
  portal = true,
  ...props
}: ComboBoxProps<T> & {
  portal?: boolean;
  Trigger(props: { open: boolean; setOpen(value: SetStateAction<boolean>): void }): React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: T) => {
    props.onSelect(option);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      {<props.Trigger open={open} setOpen={setOpen} />}
      <Popover.Content portal={portal} className={css({ p: 0, w: "20rem", md: { w: "20rem" } })}>
        <ComboBox {...props} onSelect={handleSelect} />
      </Popover.Content>
    </Popover.Root>
  );
}
