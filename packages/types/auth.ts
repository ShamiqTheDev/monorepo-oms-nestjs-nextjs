import { Selectable } from "kysely";
import { User as DBUser, Role } from "./db";

export type SessionUser = Omit<Selectable<DBUser>, "password">;

export interface User {
  id: string;
  email: string;
  role: Role;
}

export type Secrets = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export interface Login {
  email: string;
  password: string;
}

export interface LoginPayload {
  user: SessionUser;
  secrets: Secrets;
}

export interface RefreshPayload {
  access_token: string;
  expires_in: number;
}
