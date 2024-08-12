import { config } from "@atdb/client-config";
import { Auth as AuthT, DB } from "@atdb/types";
import * as path from "path";
import { credentialsSchema } from "./auth.schema";

const BASE_URL = config.NEXT_PUBLIC_API_URL;

export class Auth {
  static async apiCall<T>(input: string, init?: RequestInit): Promise<Response> {
    const res = await fetch(path.join(BASE_URL, input), init);
    return res;
  }

  static async request<T>(input: string, init?: RequestInit): Promise<T | null> {
    const res = await this.apiCall(input, init);
    if (!res.ok) return null;

    const data: T = await res.json();
    return data;
  }

  static async login(credentials: AuthT.Login) {
    credentialsSchema.parse(credentials);

    const data = await Auth.request<AuthT.LoginPayload>("auth/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(credentials),
    });

    return data;
  }

  static async refreshToken({ refresh_token }: { refresh_token: string }) {
    const data = await Auth.request<AuthT.RefreshPayload>("auth/refresh", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Refresh ${refresh_token}`,
      },
      method: "POST",
      body: JSON.stringify({ refresh_token }),
    });

    return data;
  }

  public async me(access_token: string) {
    const data = await Auth.request<DB.User>("users/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      method: "GET",
    });

    return data;
  }
}
