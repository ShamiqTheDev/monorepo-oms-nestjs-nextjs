import { styled } from "@atdb/design-system";
import { CategoriesDataTable } from "./categories.table";
import { fetchCategories, fetchSubCategories } from "../../orders/server-utils";

interface CategoriesSettingsProps {}

export async function CategoriesSettings(_: CategoriesSettingsProps) {
  const categories = (await fetchCategories()).filter((category) => !category.deleted);
  const subCategories = (await fetchSubCategories()).filter((subCategory) => !subCategory.deleted);

  return (
    <>
      <styled.div fontSize={"14px"}>
        <CategoriesDataTable data={[...categories, ...subCategories]} />
      </styled.div>
    </>
  );
}
