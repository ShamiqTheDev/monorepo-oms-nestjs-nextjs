"use server";

import { getServerSession } from "next-auth";
import { SubCategoriesSchema, subCategoriesSchema } from "./sub-categories.schema";
import authOptions from "@atdb/auth-options";
import { Auth } from "@atdb/client-services";
import { z } from "zod";

export const deleteSubCategory = async (id: number) => {
  z.number().parse(id);
  const session = await getServerSession(authOptions);

  const res = await Auth.apiCall(`sub-categories/${id}`, {
    cache: "no-store",
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  return res.ok;
};

export const createSubCategory = async (data: SubCategoriesSchema) => {
  subCategoriesSchema.parse(data);

  const session = await getServerSession(authOptions);

  const res = await Auth.apiCall("sub-categories", {
    cache: "no-store",
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  return res.ok;
};
