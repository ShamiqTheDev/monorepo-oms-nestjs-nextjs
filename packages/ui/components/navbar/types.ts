import { DB } from "@atdb/types";
import type { Selectable } from "kysely";

export interface Notification extends Selectable<DB.Notification> {
  initiator: DB.User;
  recipient: DB.User;
}
