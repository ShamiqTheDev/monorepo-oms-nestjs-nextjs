"use server";

import { getServerSession } from "next-auth";
import { CategoriesSchema, categoriesSchema } from "./categories.schema";
import authOptions from "@atdb/auth-options";
import { Auth } from "@atdb/client-services";
import { z } from "zod";

export const deleteCategory = async (id: number) => {
  z.number().parse(id);
  const session = await getServerSession(authOptions);

  const res = await Auth.apiCall(`categories/${id}`, {
    cache: "no-store",
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  return res.ok;
};

export const createCategory = async (data: CategoriesSchema) => {
  categoriesSchema.parse(data);
  const session = await getServerSession(authOptions);

  const res = await Auth.apiCall("categories", {
    cache: "no-store",
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  return res.ok;
};
