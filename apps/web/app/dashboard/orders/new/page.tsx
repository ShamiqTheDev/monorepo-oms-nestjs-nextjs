import { styled } from "@atdb/design-system";
import { CreateOrderForm } from "./form";
import { fetchAppSettings, fetchUsers } from "../../../../server-utils";
import { fetchCategories, fetchSubCategories } from "../server-utils";

export default async function Page() {
  const categories = await fetchCategories();
  const subCategories = await fetchSubCategories();
  const appSettings = await fetchAppSettings();
  const users = await fetchUsers();

  return (
    <div>
      <styled.h2 textStyle={"textStyles.headings.h2"} fontWeight={600} mb={"xl"}>
        Create Order
      </styled.h2>
      <styled.div>
        <CreateOrderForm
          {...{
            appSettings,
            categories: categories.filter((category) => !category.deleted),
            subCategories: subCategories.filter((subCategory) => !subCategory.deleted),
            users: users.filter((user) => !user.deleted),
          }}
        />
      </styled.div>
    </div>
  );
}
