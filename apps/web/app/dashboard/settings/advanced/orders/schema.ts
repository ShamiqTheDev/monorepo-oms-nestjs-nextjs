import { z } from "zod";

export const ordersSettingsSchema = z.strictObject({
  orderStatuses: z.array(z.string()),
  locations: z.array(z.string()),
});

export type OrdersSettingsSchema = z.infer<typeof ordersSettingsSchema>;
