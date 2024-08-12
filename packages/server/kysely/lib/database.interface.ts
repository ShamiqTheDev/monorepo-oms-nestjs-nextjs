import { DB } from "@atdb/types";

export interface Database {
  users: DB.User;
  invitations: DB.Invitation;
  orders: DB.Order;
  categories: DB.Category;
  subcategories: DB.SubCategory;
  orderChanges: DB.OrderChange;
  notifications: DB.Notification;
  orderComments: DB.OrderComment;
  patients: DB.Patient;
  orderStatuses: DB.OrderStatus;
  locations: DB.Location;
}
