import { DB } from "@atdb/types";

export interface JwtUserPayload {
  sub: string;
  email: string;
  role: DB.Role;
}
