"use client";

import { css, cx, icon, styled } from "@atdb/design-system";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Form,
  Button,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  Command,
} from "@atdb/ui";
import { Selectable } from "kysely";
import { DB } from "@atdb/types";
import { useInvite } from "./form.action";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormSchema, formSchema } from "./form.schema";
import { ChevronsUpDown, Check } from "lucide-react";

const VAStack = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
  },
});

interface SignUpFormProps {
  invite: Selectable<DB.Invitation>;
  appSettings: Selectable<DB.AppSettings>;
}

export function SignUpForm({ invite, appSettings }: SignUpFormProps) {
  const [_, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<FormSchema> = (data: FormSchema) => {
    startTransition(async () => {
      const isSuccess = await useInvite(data);

      if (isSuccess) {
        form.reset();
        router.push("/api/auth/signin"); // TODO: /login (custom signin page)
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={css({ spaceY: "8", fontSize: "sm" })}>
        <VAStack gap={"xl"}>
          <input {...form.register("invitationId")} type="hidden" name="invitationId" value={invite.id} />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input.Root w={"full"}>
                    {/* <Input.Icon>
                      <Sms size={"20px"} />
                    </Input.Icon> */}
                    <Input.Control type={"text"} placeholder="First Name" {...field} />
                  </Input.Root>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input.Root w={"full"}>
                    {/* <Input.Icon>
                      <Sms size={"20px"} />
                    </Input.Icon> */}
                    <Input.Control type={"text"} placeholder="Last Name" {...field} />
                  </Input.Root>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input.Root w={"full"}>
                    {/* <Input.Icon>
                      <PasswordCheck size={"20px"} />
                    </Input.Icon> */}
                    <Input.Control type={"password"} placeholder="Password" {...field} />
                  </Input.Root>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Confirmation</FormLabel>
                <FormControl>
                  <Input.Root w={"full"}>
                    {/* <Input.Icon>
                      <PasswordCheck size={"20px"} />
                    </Input.Icon> */}
                    <Input.Control type={"password"} placeholder="Password Confirmation" {...field} />
                  </Input.Root>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="defaultLocationId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Location</FormLabel>
                <FormControl>
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <FormControl>
                        <Button
                          bg="gray.100"
                          width="100%"
                          _placeholder={{ color: "gray.500" }}
                          variant="outline"
                          role="combobox"
                          justifyContent="space-between"
                          color={field.value ? "gray.900" : "muted.foreground"}
                          border="1px solid token(colors.gray.300)"
                        >
                          {field.value ? appSettings.locations.find((location) => location.id === field.value)?.name : "Select location"}
                          <ChevronsUpDown className={cx(icon({ left: "auto", dimmed: true }), css({ w: "xl", h: "auto" }))} />
                        </Button>
                      </FormControl>
                    </Popover.Trigger>
                    <Popover.Content className={css({ p: 0, w: "20rem" })}>
                      <Command>
                        <CommandInput placeholder="Search locations..." />
                        <CommandEmpty>No location found.</CommandEmpty>
                        <CommandGroup>
                          {appSettings.locations.map((location) => (
                            <CommandItem
                              value={location.id}
                              key={location.id}
                              onSelect={() => {
                                form.setValue("defaultLocationId", location.id);
                              }}
                            >
                              <Check className={css({ w: "xl", h: "auto" })} opacity={location.id === field.value ? "1" : "0"} />
                              {location.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </Popover.Content>
                  </Popover.Root>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button boxShadow={"0px 9px 17px 0px rgba(23, 68, 110, 0.15);"} type="submit">
            Sign Up
          </Button>
        </VAStack>
      </form>
    </Form>
  );
}
