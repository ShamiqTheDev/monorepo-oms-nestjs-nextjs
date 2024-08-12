"use server";

import authOptions from "@atdb/auth-options";
import { Auth } from "@atdb/client-services";
import { DB } from "@atdb/types";
import { Selectable, Updateable } from "kysely";
import { getServerSession } from "next-auth";
import { OrdersSettingsSchema, ordersSettingsSchema } from "./schema";
import { AppSettings } from "@atdb/types/db";

const distinctColors = [
  "gray", "mauve", "slate", "sage", "olive", "sand", "tomato", "red", "ruby", 
  "crimson", "pink", "plum", "purple", "violet", "iris", "indigo", "blue", 
  "cyan", "teal", "jade", "green", "grass", "bronze", "gold", "brown", 
  "orange", "amber", "yellow", "lime", "mint", "sky"
];


export const updateSettings = async (newAppSettings: OrdersSettingsSchema, oldAppSettings: Selectable<AppSettings>) => {
  ordersSettingsSchema.parse(newAppSettings);
  const session = await getServerSession(authOptions);

  const usedColors = oldAppSettings.orderStatuses.map((status) => status.color);
  const unusedColors = distinctColors.filter((color) => !usedColors.includes(color));
  const updateSettingsRequest: Updateable<DB.AppSettings> = {
    orderStatuses: newAppSettings.orderStatuses.map((status) => {
      let color: string;
      if (!unusedColors.length) color = distinctColors[Math.floor(Math.random() * distinctColors.length)];
      else {
        const newColorIndex = Math.floor(Math.random() * unusedColors.length);
        color = unusedColors[newColorIndex];
        unusedColors.splice(newColorIndex, 1);
      }
      return {
        label: status,
        color: color,
      };
    }),
    locations: newAppSettings.locations.map((location) => ({ name: location })),
  };

  const res = await Auth.apiCall("/settings", {
    method: "POST",
    body: JSON.stringify(updateSettingsRequest),
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  return res.ok;
};
