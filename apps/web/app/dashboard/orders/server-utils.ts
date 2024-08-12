'use server';

import { Insertable, Selectable, Updateable } from 'kysely';
import { createPatient, fetchPatient } from '../patients/utils';
import { StorageClient } from '@supabase/storage-js';
import { LoginPayload } from '@atdb/types/auth';
import { Auth } from '@atdb/client-services';
import { config } from '@atdb/client-config';
import authOptions from '@atdb/auth-options';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import type { Order, OrderWCommentsAndChanges } from './type';
import { DB } from '@atdb/types';
import { Resend } from 'resend';

const STORAGE_URL = `https://${config.DATABASE_REF}.supabase.co/storage/v1`;
const SERVICE_KEY = config.DATABASE_SERVICE_KEY;

const storage = new StorageClient(STORAGE_URL, {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
});

const bucketName = 'illuminated-photos';
const bucket = storage.from(bucketName);

const resend = new Resend(config.RESEND_API_KEY);

export const getIp = () => {
  const headersList = headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');

  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  if (realIp) return realIp.trim();

  return null;
};

export const getGeo = async () => {
  const ip = getIp();
  if (!ip) return 'Unknown';

  const req = await fetch(`http://ip-api.com/json/${ip}`);
  const { status, country, region, city } = await req.json();
  if (status !== 'success') return 'Unknown';

  return `${city}, ${region}, ${country}`;
};

export const fetchUser = async (id: string): Promise<Selectable<DB.User> | null> => {
  const session = await getServerSession(authOptions);

  const user = await Auth.request<Selectable<DB.User>>(`users/${id}`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  return user;
};

export const uploadAttachments = async (files: File[]) => {
  const attachmentUrls: string[] = [];
  for (const file of files) {
    const uploadedAttachment = await bucket.upload(`${file.name.replace(/[^a-zA-Z0-9_\/!-.*'() &@$=;:+,?]/g, '')}@${Date.now()}`, file);
    if (uploadedAttachment.error) continue;

    const {
      data: { publicUrl: attachmentUrl },
    } = bucket.getPublicUrl(uploadedAttachment.data.path);
    attachmentUrls.push(attachmentUrl);
  }

  return attachmentUrls;
};

export const deleteAttachments = async (urls: string[]) => {
  const filePaths = urls.map((url) => decodeURIComponent(url.split(`/storage/v1/object/public/${bucketName}/`)[1]));
  const { error } = await bucket.remove(filePaths);

  if (error) {
    console.error('Error deleting files:', error);
  }
};

export const sendNotification = async (accessToken: string, data: Insertable<DB.Notification>[]) => {
  if (!data.length) return null;
  return Auth.apiCall(`notifications`, {
    cache: 'no-store',
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
  });
};

export const sendEmail = async (to: string, subject: string, html: string) => {
  return resend.emails.send({ from: 'notifications@emails.dentalzorg.com', to: to, subject, html });
};

export async function constructOrder<T extends Updateable<DB.Order> | Insertable<DB.Order>>(
  session: LoginPayload,
  formData: FormData,
  constData: Updateable<DB.Order> = {}
): Promise<T | null> {
  let patientId: number | undefined;
  const patientRef = (formData.get('patientRef') as string) || undefined;
  if (patientRef) {
    patientId = parseInt(formData.get('patientId') as string);
    if (!patientId) {
      const patientName = formData.get('patientName') as string;
      const patientDOB = formData.get('patientBirthdate') as string;
      const patientOwnerId = formData.get('patientOwnerId') as string;

      if (!patientName || !patientDOB) {
        return null;
      }
      patientId = (await createPatient({ birthdate: patientDOB, refId: patientRef, name: patientName, ownerId: patientOwnerId }))?.id;
      if (!patientId) return null;
    }
  }

  // Iterate over form data instead!
  const order = {
    patientId,
    specialistId: (formData.get('specialistId') as string) || undefined,
    locationId: parseInt(formData.get('locationId') as string) || undefined,
    deliveryDate: (formData.get('deliveryDate') as string) || undefined,
    assigneeId: DB.ADMINISTRATIVE_ROLES.includes(session?.user.role as (typeof DB.ADMINISTRATIVE_ROLES)[number])
      ? (formData.get('assigneeId') as string)
      : undefined,
    categoryId: parseInt(formData.get('categoryId') as string) || undefined,
    subcategoryId: parseInt(formData.get('subcategoryId') as string) || undefined,
    specificDetails: (formData.get('specificDetails') as string) || undefined,
    priority: (formData.get('priority') as DB.Priority) || undefined,
    imagesAttached: formData.get('imagesAttached') === 'true' ? true : formData.get('imagesAttached') === 'false' ? false : undefined,
    metadata: (formData.get('metadata') as string) || undefined,
    statusId: DB.ADMINISTRATIVE_ROLES.includes(session?.user.role as (typeof DB.ADMINISTRATIVE_ROLES)[number])
      ? parseInt(formData.get('statusId') as string)
      : undefined,
  } as T;

  const attachments = Array.from(formData.getAll('illuminatedPhotos') as unknown as FileList);
  const attachmentsUrls = await uploadAttachments(attachments);
  order.illuminatedPhotos = attachmentsUrls;

  return { ...order, ...constData };
}

const isFalsyOrEmpty = (value: any) => !value || value?.length === 0 || (typeof value === 'object' && Object.keys(value)?.length === 0);

export const updateOrder = async (orderId: number, oldOrder: Partial<Selectable<DB.Order>>, orderUpdate: Updateable<DB.Order>) => {
  const session = await getServerSession(authOptions);
  if (!session) return false;

  const updateOrdersRes = await Auth.apiCall(`orders/${orderId}`, {
    cache: 'no-store',
    method: 'PATCH',
    body: JSON.stringify(orderUpdate),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  if (!updateOrdersRes.ok) return false;

  const changedFields = {} as any;
  for (const [key, value] of Object.entries(orderUpdate)) {
    if (value === undefined || key === 'onHold') continue;
    let oldValue = oldOrder[key];

    if (key === 'metadata') {
      const oldFields = (oldOrder.metadata as DB.OrderMetadata)?.fields || [];
      const newFields = (JSON.parse(value as string) as DB.OrderMetadata).fields;

      newFields.forEach((field, i) => {
        if (oldFields[i]?.value !== field.value) {
          changedFields[`Metafield '${field.name}'`] = { old: oldFields[i]?.value.toString(), new: field.value.toString() };
        }
      });
    } else if (key === 'specificDetails') {
      oldValue = JSON.stringify(oldValue);
      if (oldValue !== value) {
        changedFields[key] = { old: oldValue, new: value };
      }
    } else if (key === 'illuminatedPhotos') {
      if (JSON.stringify(oldValue) !== JSON.stringify(value)) {
        changedFields[key] = { old: oldValue, new: value };
      }
    } else if (key === 'patientId') {
      if (oldValue !== value) {
        changedFields[key] = { old: (await fetchPatient(oldValue as number))!.refId, new: (await fetchPatient(value as number))!.refId };
      }
    } else if (oldValue !== value && !(isFalsyOrEmpty(oldValue) && isFalsyOrEmpty(value))) {
      changedFields[key] = { old: oldValue?.toString(), new: value?.toString() };
    }
  }
  if (isFalsyOrEmpty(changedFields)) return true;
  const geo = await getGeo();
  const createOrderChange = await Auth.apiCall(`order-changes`, {
    cache: 'no-store',
    method: 'POST',
    body: JSON.stringify({ changed_fields: JSON.stringify(changedFields), orderId: orderId, initiatorId: session?.user?.id, geo }),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  return createOrderChange.ok;
};

export const fetchOrders = async (closed: boolean): Promise<Order[]> => {
  const session = await getServerSession(authOptions);

  const orders = await Auth.request<Order[]>(`orders?closed=${closed.toString()}`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  return orders || [];
};

type FetchOrderReturnType<T extends boolean> = T extends true ? OrderWCommentsAndChanges | null : Order | null;
export const fetchOrder = async <T extends boolean>(id: string, wCommentsAndChanges: T = false as T): Promise<FetchOrderReturnType<T>> => {
  const session = await getServerSession(authOptions);
  return await Auth.request<FetchOrderReturnType<T>>(`orders/${id}?wCommentsAndChanges=${wCommentsAndChanges.toString()}`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${session?.secrets.access_token}` },
  });
};

export const fetchCategories = async (): Promise<Selectable<DB.Category>[]> => {
  const session = await getServerSession(authOptions);

  const categories = await Auth.request<Selectable<DB.Category>[]>('categories', {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  return categories || [];
};

export const fetchSubCategories = async (): Promise<Selectable<DB.SubCategory>[]> => {
  const session = await getServerSession(authOptions);

  const subCategories = await Auth.request<Selectable<DB.SubCategory>[]>('sub-categories', {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  return subCategories || [];
};
