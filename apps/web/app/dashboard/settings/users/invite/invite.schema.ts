import { DB } from "@atdb/types";
import { Insertable } from "kysely";
import { z } from "zod";

export const inviteSchema = z.strictObject({
  email: z.string().email("Please enter a valid email address"),
  role: z.nativeEnum(DB.Role, {
    invalid_type_error: "Please select a role",
  }),
}) satisfies z.ZodType<Insertable<DB.Invitation>>;

export type InviteSchema = z.infer<typeof inviteSchema>;
