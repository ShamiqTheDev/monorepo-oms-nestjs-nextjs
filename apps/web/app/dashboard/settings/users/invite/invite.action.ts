"use server";

import { getServerSession } from "next-auth";
import { inviteSchema, InviteSchema } from "./invite.schema";
import authOptions from "@atdb/auth-options";
import { Auth } from "@atdb/client-services";

export const inviteUser = async (data: InviteSchema) => {
  inviteSchema.parse(data);
  const session = await getServerSession(authOptions);

  const res = await Auth.apiCall("invitations", {
    cache: "no-store",
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  return res.ok;
};
