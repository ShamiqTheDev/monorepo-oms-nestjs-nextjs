import { z } from "zod";

export const commentSchema = z.object({
  content: z.string().min(1),
  authorId: z.string().uuid(),
  orderId: z.number().min(1).positive(),
  attachments: z.array(z.instanceof(Blob)).optional(),
});

export type CommentSchema = z.infer<typeof commentSchema>;
