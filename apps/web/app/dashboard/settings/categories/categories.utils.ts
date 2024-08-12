import { Selectable } from "kysely";
import { DB } from "@atdb/types";

export const isSubCategory = (category: Selectable<DB.SubCategory> | Selectable<DB.Category>): category is Selectable<DB.SubCategory> => {
  return "categoryId" in category;
};
