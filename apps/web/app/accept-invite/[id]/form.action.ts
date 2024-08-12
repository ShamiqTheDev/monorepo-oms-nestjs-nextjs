"use server";

import { Auth } from "@atdb/client-services";
import { FormSchema } from "./form.schema";

export const useInvite = async ({ invitationId, ...props }: FormSchema) => {
  const res = await Auth.apiCall(`invitations/accept/${invitationId}`, {
    method: "POST",
    body: JSON.stringify(props),
    headers: { "Content-Type": "application/json" },
  });

  return res.ok;
};
