'use server'

import { DB } from "@atdb/types";
import { Insertable, Selectable } from "kysely";
import { Auth } from "@atdb/client-services";
import { getServerSession } from "next-auth";
import authOptions from "../../api/auth/[...nextauth]/auth-options";

export const fetchPatients = async (ownerId?: string): Promise<Selectable<DB.Patient>[] | null> => {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const urlQueries = ownerId? `?ownerId=${ownerId}`: "";
  const patients = await Auth.request<Selectable<DB.Patient>[]>(`patients${urlQueries}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  return patients || [];
};

export const fetchPatient = async (patientId: number): Promise<Selectable<DB.Patient> | null> => {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const patient = await Auth.request<Selectable<DB.Patient>>(`patients/${patientId}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${session.secrets.access_token}` },
  });

  return patient;
};

export const fetchPatientByRef = async (patientRef: string, ownerId?: string): Promise<Selectable<DB.Patient> | null> => {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  let urlQueries = `patientRef=${patientRef}`;
  if (ownerId) urlQueries += `&ownerId=${ownerId}`;
  const patient = await Auth.request<Selectable<DB.Patient>>(`patients/by-ref/?${urlQueries}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${session.secrets.access_token}` },
  });
  return patient;
};

export const createPatient = async (data: Insertable<DB.Patient>): Promise<Selectable<DB.Patient> | null> => {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const createdPatient = await Auth.request<Selectable<DB.Patient>>("patients", {
    method: "POST",
    cache: "no-store",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.secrets.access_token}` },
  });

  if (!createdPatient) return null;
  return createdPatient;
};
