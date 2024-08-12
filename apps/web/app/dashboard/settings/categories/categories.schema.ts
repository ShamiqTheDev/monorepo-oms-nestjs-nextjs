import { DB } from "@atdb/types";
import { Insertable } from "kysely";
import { z } from "zod";

export const categoriesSchema = z.strictObject({
  name: z.string().min(1).max(255, {
    message: "Must be less than 255 characters",
  }),
}) satisfies z.ZodType<Insertable<DB.Category>>;

export type CategoriesSchema = z.infer<typeof categoriesSchema>;
