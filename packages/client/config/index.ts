import { createEnv } from "@t3-oss/env-nextjs";
import { ENV } from "@atdb/types";
import z, { ZodType } from "zod";

export const config = createEnv<
  Record<keyof ENV.Web["server"], ZodType>,
  Record<keyof ENV.Web["client"], ZodType>,
  Record<keyof ENV.Web["server"] & keyof ENV.Web["client"], ZodType>
>({
  server: {
    NODE_ENV: z.nativeEnum(ENV.Environment),
    JWT_EXPIRES_IN: z.string(),
    REFRESH_JWT_EXPIRES_IN: z.string(),
    NEXTAUTH_SECRET: z.string(),
    DATABASE_REF: z.string(),
    DATABASE_SERVICE_KEY: z.string(),
    RESEND_API_KEY: z.string(),
    DEFAULT_ASSIGNEE_ID: z.string(),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string(),
    NEXT_PUBLIC_HOSTNAME: z.string(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    REFRESH_JWT_EXPIRES_IN: process.env.REFRESH_JWT_EXPIRES_IN,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    DATABASE_REF: process.env.DATABASE_REF,
    DATABASE_SERVICE_KEY: process.env.DATABASE_SERVICE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_HOSTNAME: process.env.NEXT_PUBLIC_HOSTNAME,
    DEFAULT_ASSIGNEE_ID: process.env.DEFAULT_ASSIGNEE_ID,
  },
});
