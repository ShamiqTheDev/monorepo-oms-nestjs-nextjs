'use server';

import authOptions from '@atdb/auth-options';
import { Auth } from '@atdb/client-services';
import { DB } from '@atdb/types';
import { Selectable } from 'kysely';
import { getServerSession } from 'next-auth';

export const fetchAppSettings = async (): Promise<Selectable<DB.AppSettings>> => {
  const session = await getServerSession(authOptions);

  const appSettings = await Auth.request<Selectable<DB.AppSettings>>('settings', {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  if (!appSettings) return { orderStatuses: [], locations: [], categories: [], subCategories: [] };
  return appSettings;
};

export const fetchUsers = async (): Promise<Selectable<DB.User>[]> => {
  const session = await getServerSession(authOptions);
  const users = await Auth.request<Selectable<DB.User>[]>('users', {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  return users || [];
};
