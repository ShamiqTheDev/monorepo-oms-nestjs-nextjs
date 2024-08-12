"use server";

import authOptions from "@atdb/auth-options";
import { Auth } from "@atdb/client-services";
import { DB } from "@atdb/types";
import { Insertable } from "kysely";
import { getServerSession } from "next-auth";

export const insertBulkPatients = async (patients: Insertable<DB.Patient>[]) => {
  const session = await getServerSession(authOptions);

  const res = await Auth.apiCall("/patients/bulk", {
    method: "POST",
    body: JSON.stringify(patients),
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  return res.ok;
};

export const flushPatients = async () => {
  const session = await getServerSession(authOptions);

  const res = await Auth.apiCall("/patients", {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  return res.ok;
};
