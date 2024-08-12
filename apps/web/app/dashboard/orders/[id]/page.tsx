import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderView from "./view";
import { fetchAppSettings, fetchUsers } from "../../../../server-utils";
import { fetchOrder } from "../server-utils";
import type { Order } from "../type";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params: { id } }: Props): Promise<Metadata> {
  const order = await fetchOrder(id);
  if (!order || order.deleted) return notFound();

  return {
    title: `Order #${order.id.toString().padStart(4, "0")}`,
  };
}

export default async function Order({ params: { id } }: Props) {

  const users = await fetchUsers();
  const appSettings = await fetchAppSettings();


  return <OrderView {...{ id, users, appSettings }} />;
}
