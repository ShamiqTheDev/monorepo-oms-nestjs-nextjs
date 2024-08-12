import { z } from "zod";
import { testPassword } from "../../utils";

export const formSchema = z
  .strictObject({
    invitationId: z.string().length(32, {
      message: "Invalid invitation",
    }),

    firstName: z.string().min(1).max(255, {
      message: "Must be less than 255 characters",
    }),

    lastName: z.string().min(1).max(255, {
      message: "Must be less than 255 characters",
    }),

    password: z
      .string()
      .max(255)
      .refine((password) => testPassword(password), {
        message: "Password must be at least 8 characters in length and must not contain any non-English letters",
      }),

    confirmPassword: z.string(),

    defaultLocationId: z.number().int().positive().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type FormSchema = z.infer<typeof formSchema>;
