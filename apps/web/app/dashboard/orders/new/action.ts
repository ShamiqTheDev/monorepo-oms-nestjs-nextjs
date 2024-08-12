"use server";

import { Auth } from "@atdb/client-services";
import { config } from "@atdb/client-config";
import authOptions from "@atdb/auth-options";
import { getServerSession } from "next-auth";
import { constructOrder } from "../server-utils";

export const createOrder = async (data: FormData) => {
  const session = await getServerSession(authOptions);
  if (!session) return false;

  const order = await constructOrder(session, data, {
    createdBy: session.user.id,
    assigneeId: config.DEFAULT_ASSIGNEE_ID,
    statusId: 1,
  });
  if (!order) return false;

  const res = await Auth.apiCall("orders", {
    cache: "no-store",
    method: "POST",
    body: JSON.stringify(order),
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.secrets.access_token}` },
  });

  return res.ok;
};
