"use server";

import authOptions from "@atdb/auth-options";
import { DB } from "@atdb/types";
import { Selectable } from "kysely";
import { getServerSession } from "next-auth";
import { updateOrder, constructOrder } from "../../server-utils";

export const editOrder = async (order: Selectable<DB.Order>, data: FormData) => {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const updatedOrder = await constructOrder(session, data);
  if (!updatedOrder) return false;

  updatedOrder.illuminatedPhotos?.push(...(order.illuminatedPhotos || []));
  return await updateOrder(order.id, order, updatedOrder);
};
