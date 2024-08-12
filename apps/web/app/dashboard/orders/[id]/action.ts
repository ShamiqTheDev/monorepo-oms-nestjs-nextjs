"use server";

import authOptions from "@atdb/auth-options";
import { Auth } from "@atdb/client-services";
import { DB } from "@atdb/types";
import { getServerSession } from "next-auth";
import { fetchUser, updateOrder, sendNotification, sendEmail, deleteAttachments } from "../server-utils";
import { Order } from "../type";
import { Selectable } from "kysely";

export const deleteOrder = async (id: number) => {
  const session = await getServerSession(authOptions);

  const res = await Auth.apiCall(`orders/${id}`, {
    cache: "no-store",
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  return res.ok;
};

export const updateOrderAssignee = async (orderId: number, oldAssigneeId: string, newAssigneeId: string) => {
  const newAssignee = await fetchUser(newAssigneeId);
  if (oldAssigneeId === newAssigneeId || !newAssignee) return false;

  const session = await getServerSession(authOptions);
  const result = await updateOrder(orderId, { assigneeId: oldAssigneeId }, { assigneeId: newAssigneeId });
  if (!result) return false;

  await sendNotification(session!.secrets.access_token, [
    {
      recipientId: newAssigneeId,
      action: DB.NotificationAction.Assign,
      metadata: JSON.stringify({ orderId: orderId }),
    },
  ]);

  await sendEmail(
    newAssignee.email,
    "Dentalzorg - Assign",
    `<h1>You have been assigned to order with ID #${orderId.toString().padStart(4, "0")}</h1>`
  );

  return true;
};


export const fetchOrderPdf = async (id: string): Promise<string> => {
  const session = await getServerSession(authOptions);
  const res = await Auth.apiCall<Order>(`orders/${id}/pdf`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${session?.secrets.access_token}`, Accept: "application/pdf" },
  });

  const buffer = Buffer.from(await res.arrayBuffer());
  return buffer.toString("base64");
};

export const deleteComment = async (id: number) => {
  const session = await getServerSession(authOptions);

  const res = await Auth.request<Selectable<DB.OrderComment>>(`orders/comments/${id}`, {
    cache: "no-store",
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.secrets.access_token}` },
  });
  if (!res) return null;
  if (res.attachments?.length) await deleteAttachments(res.attachments);
  return true;
};
