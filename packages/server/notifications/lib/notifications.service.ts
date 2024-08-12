import { Database, InjectKysely } from "@atdb/server-kysely";
import { Injectable } from "@nestjs/common";
import { DB } from "@atdb/types";
import type { Insertable, Kysely, Selectable } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";

@Injectable()
export class NotificationsService {
  constructor(@InjectKysely() private readonly kysely: Kysely<Database>) {}

  async createByUser(data: Omit<Insertable<DB.Notification>, "initiatorId">[], userId: string) {
    // @ts-ignore
    const notification: Insertable<DB.Notification>[] = data.map((d) => ({ ...d, initiatorId: userId }));
    const query = this.kysely.insertInto("notifications").values(notification);
    await query.execute();
  }

  async delete(id: string) {
    const query = this.kysely.deleteFrom("notifications").where("id", "=", id);
    await query.execute();
  }

  async getAllUserNotification(userId: string): Promise<Selectable<DB.Notification>[] | undefined> {
    const query = this.kysely
      .selectFrom("notifications")
      .selectAll()
      .where("recipientId", "=", userId)
      .select((eb) => [
        // @ts-ignore
        jsonObjectFrom(eb.selectFrom("users").selectAll("users").whereRef("users.id", "=", "notifications.initiatorId")).as("initiator"),
        jsonObjectFrom(eb.selectFrom("users").selectAll("users").whereRef("users.id", "=", "notifications.recipientId")).as("recipient"),
      ]);
    return await query.execute();
  }
}
