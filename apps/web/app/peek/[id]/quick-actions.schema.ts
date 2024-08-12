import { z } from "zod";

export const orderQuickActionsSchema = z.strictObject({
  statusId: z.number().int().positive(),
  assigneeId: z.string().uuid(),
  illuminatedPhotos: z.array(z.instanceof(Blob)).optional(),
});

export type OrderQuickActionsSchema = z.infer<typeof orderQuickActionsSchema>;
