import { ColumnType, Generated, GeneratedAlways, Insertable, Selectable, Updateable } from "kysely";
import { type TElement } from "@udecode/plate-common";

export enum Priority {
  High = "high",
  Medium = "medium",
  Low = "low",
}

export enum Role {
  Superadmin = "superadmin",
  Admin = "admin",
  Employee = "employee",
  Customer = "customer",
}

export enum NotificationAction {
  Assign = "assign",
  Reminder = "reminder",
  Mention = "mention",
}

export interface OrderMetadataField {
  name: string;
  value: string | boolean | number;
}
export interface OrderMetadata {
  fields: OrderMetadataField[];
  [key: string]: unknown;
}

export const ADMINISTRATIVE_ROLES = [Role.Superadmin, Role.Admin, Role.Employee] as const;

export interface Invitation {
  id: Generated<string>;
  createdAt: Generated<string>;
  email: string;
  role: Role;
}

export const COLORS = ["imperative", "instructive", "destructive", "constructive"] as const;
export type Colors = (typeof COLORS)[number];

export interface OrderStatus {
  id: GeneratedAlways<number>;
  label: string;
  color: string;
  deleted: Generated<boolean>;
}

export interface Location {
  id: GeneratedAlways<number>;
  name: string;
  deleted: Generated<boolean>;
}

export interface Patient {
  id: GeneratedAlways<number>;
  refId: string;
  name: string;
  birthdate: string;
  ownerId: string | null;
}

export interface User {
  id: Generated<string>;
  createdAt: Generated<string>;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatarUrl?: string;
  role: Role;
  deleted: Generated<boolean>;
  defaultLocationId?: number;
}

export interface Category {
  id: GeneratedAlways<number>;
  name: string;
  deleted: Generated<boolean>;
}

export type OrderChangeName = keyof Insertable<Order>;

export interface OrderChange {
  id: GeneratedAlways<number>;
  createdAt: Generated<string>;
  initiatorId: string;
  orderId: number;
  changedFields: ColumnType<Record<Exclude<OrderChangeName, undefined>, { old: string; new: string }>, string>;
  geo: string;
}

export interface OrderComment {
  id: GeneratedAlways<number>;
  createdAt: Generated<string>;
  content: string;
  authorId: string;
  orderId: number;
  attachments?: string[];
  deleted: Generated<boolean>;
}

interface NotificationBase {
  id: GeneratedAlways<string>;
  createdAt: Generated<string>;
  read: Generated<boolean>;
  action: NotificationAction;
  metadata: ColumnType<Record<string, unknown>, string, string>;
}

export interface ReminderNotification extends NotificationBase {
  action: NotificationAction.Reminder;
  recipientId: string;
}

export interface MentionNotification extends NotificationBase {
  action: NotificationAction.Mention;
  initiatorId: string;
  recipientId: string;
}

export interface AssignNotification extends NotificationBase {
  action: NotificationAction.Assign;
  initiatorId: string;
  recipientId: string;
}

export type Notification = ReminderNotification | AssignNotification | MentionNotification;

export enum FieldType {
  Text = "text",
  Number = "number",
  Date = "date",
  Boolean = "boolean",
  Select = "select",
}

export interface BaseField {
  name: string;
  type: FieldType;
  required: boolean;
}

export interface EveryField extends BaseField {
  type: FieldType.Date | FieldType.Number | FieldType.Text;
  defaultValue?: string;
}

export interface SelectField extends BaseField {
  type: FieldType.Select;
  options: string[];
  defaultValue?: string;
}

export interface BooleanField extends BaseField {
  type: FieldType.Boolean;
  defaultValue?: boolean;
}

export type Field = EveryField | SelectField | BooleanField;

export interface SubCategory {
  id: GeneratedAlways<number>;
  name: string;
  categoryId: number;
  fields: ColumnType<Field[], string, string>;
  deleted: Generated<boolean>;
}

export interface AppSettings {
  orderStatuses: ColumnType<Selectable<OrderStatus>[], Insertable<OrderStatus>[], Updateable<OrderStatus>[]>;
  locations: ColumnType<Selectable<Location>[], Insertable<Location>[], Updateable<Location>[]>;
  categories: ColumnType<Selectable<Omit<Category, "deleted">>[], undefined, undefined>;
  subCategories: ColumnType<Selectable<Omit<SubCategory, "deleted" | "categoryId" | "fields">>[], undefined, undefined>;
}

export interface Order {
  id: GeneratedAlways<number>;
  createdBy: string;
  createdAt: Generated<string>;
  updatedAt: Generated<string>;
  patientId: Generated<number>;
  specialistId: string;
  locationId: number;
  deliveryDate: string;
  assigneeId: string;
  categoryId: number;
  subcategoryId: number;
  priority: Priority;
  statusId: number;
  specificDetails: ColumnType<TElement[], string, string>;
  illuminatedPhotos?: string[];
  onHold: Generated<boolean>;
  holdReason?: string | null;
  metadata?: ColumnType<OrderMetadata, string, string>;
  imagesAttached: Generated<boolean>;
  deleted: Generated<boolean>;
  closed: Generated<boolean>;
  urgent: Generated<boolean>;
}
