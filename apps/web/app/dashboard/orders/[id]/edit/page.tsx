import { EditOrderForm } from "./form";
import { notFound } from "next/navigation";
import { fetchAppSettings, fetchUsers } from "../../../../../server-utils";
import { fetchCategories, fetchSubCategories, fetchOrder } from "../../server-utils";

interface Props {
  params: {
    id: string;
  };
}

export default async function EditOrderPage({ params: { id } }: Props) {
  const order = await fetchOrder(id);
  if (!order || order.deleted) return notFound();

  const users = await fetchUsers();
  const subCategories = await fetchSubCategories();
  const appSettings = await fetchAppSettings();

  return (
    <EditOrderForm
      {...{
        appSettings,
        users: users.filter((user) => !user.deleted),
        subCategories: subCategories.filter((subCategory) => !subCategory.deleted),
        order,
      }}
    />
  );
}
