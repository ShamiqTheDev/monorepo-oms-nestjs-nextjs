import { z } from "zod";
import { orderSchema } from "../../new/schema";

export const editOrderSchema = orderSchema.extend({
  statusId: z.number().int().positive(),
  assigneeId: z.string().uuid(),
});

export type EditOrderSchema = z.infer<typeof editOrderSchema>;
