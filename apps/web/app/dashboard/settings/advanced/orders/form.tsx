"use client";

import { css } from "@atdb/design-system";
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, InputTags } from "@atdb/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTransition } from "react";
import { updateSettings } from "./actions";
import { OrdersSettingsSchema, ordersSettingsSchema } from "./schema";
import { useToast } from "@atdb/client-providers";
import { useSession } from "next-auth/react";
import { Selectable } from "kysely";
import { DB } from "@atdb/types";
import { useRouter } from "next/navigation";

interface OrderSettingsFormProps {
  appSettings: Selectable<DB.AppSettings>;
}

export function OrderSettingsForm({ appSettings }: OrderSettingsFormProps) {
  const [_, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const { data } = useSession();
  const form = useForm<OrdersSettingsSchema>({
    resolver: zodResolver(ordersSettingsSchema),
    defaultValues: {
      orderStatuses: appSettings.orderStatuses.filter((status) => status.id !== 1).map((status) => status.label) ?? [],
      locations: appSettings.locations.map((location) => location.name) ?? [],
    },
  });

  if (!data) return null;

  const onSubmit: SubmitHandler<OrdersSettingsSchema> = (data) => {
    startTransition(async () => {
      const isSuccess = await updateSettings(data, appSettings);
      if (isSuccess) router.refresh();

      toast({
        variant: isSuccess ? "constructive" : "destructive",
        title: isSuccess ? "Order settings is saved" : "Failed to save order settings",
        description: isSuccess ? "Order settings has been saved" : "Failed to save order settings",
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={css({ spaceY: "8", fontSize: "sm" })}>
        <FormField
          control={form.control}
          name="orderStatuses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order Statuses</FormLabel>
              <FormControl>
                <InputTags
                  additionalKeystrokes={false}
                  placeholder={"Add orders statuses"}
                  onChange={field.onChange}
                  value={field.value ?? []}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="locations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Locations</FormLabel>
              <FormControl>
                <InputTags additionalKeystrokes={false} placeholder={"Add locations"} onChange={field.onChange} value={field.value ?? []} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          bg={"primary.500"}
          _hover={{ bg: "primary.600" }}
          border={"solid 1px token(colors.primary.600)"}
          boxShadow={"0px 0px 2px -1px #0E1B2F, 0px 1px 1px 0px rgba(23, 68, 110, 0.15);"}
        >
          Save
        </Button>
      </form>
    </Form>
  );
}
