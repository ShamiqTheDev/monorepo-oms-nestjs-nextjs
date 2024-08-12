import { DB } from "@atdb/types";
import { Selectable } from "kysely";

export interface OrderChange extends Selectable<DB.OrderChange> {
  initiator: Selectable<DB.User>;
}

export interface OrderComment extends Selectable<DB.OrderComment> {
  author: Selectable<DB.User>;
}
