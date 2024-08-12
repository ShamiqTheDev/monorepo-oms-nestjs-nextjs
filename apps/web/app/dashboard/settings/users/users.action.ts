"use server";

import authOptions from "@atdb/auth-options";
import { Auth } from "@atdb/client-services";
import { getServerSession } from "next-auth";
import { z } from "zod";

export const deleteUser = async (id: string) => {
  z.string().parse(id);
  const session = await getServerSession(authOptions);

  const res = await Auth.apiCall(`/users/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  return res.ok;
};
