import { DB } from "@atdb/types";
import { Selectable } from "kysely";
import { OrderChange, OrderComment } from "./[id]/types";

export interface Order extends Selectable<DB.Order> {
  status: Selectable<DB.OrderStatus>;
  location: Selectable<DB.Location>;
  assignee: Selectable<DB.User>;
  category: Selectable<DB.Category>;
  subCategory: Selectable<DB.SubCategory>;
  patient: Selectable<DB.Patient>;
  specialist: Selectable<DB.User>;
  creator: Selectable<DB.User>;
}

export interface OrderWCommentsAndChanges extends Order {
  comments: Selectable<OrderComment>[]
  changes: Selectable<OrderChange>[]
}
