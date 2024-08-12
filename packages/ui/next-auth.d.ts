import type NextAuth from "next-auth";
import type { Auth } from "../";

declare module "next-auth" {
  type User = Auth.LoginPayload;
  type Session = Auth.LoginPayload;
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  type JWT = Auth.LoginPayload;
}
