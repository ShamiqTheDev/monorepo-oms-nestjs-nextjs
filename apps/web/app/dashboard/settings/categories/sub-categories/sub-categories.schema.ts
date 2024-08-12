import { DB } from "@atdb/types";
import { SelectField } from "@atdb/types/db";
import { Insertable } from "kysely";
import { z } from "zod";

export interface SubCategory extends Omit<Insertable<DB.SubCategory>, "fields"> {
  fields: DB.Field[];
}

const baseFieldSchema = z.object({
  name: z.string().min(1).max(255, {
    message: "Must be less than 255 characters",
  }),
  type: z.nativeEnum(DB.FieldType, {
    invalid_type_error: "Please select a field type",
  }),
  required: z.boolean(),
}) satisfies z.ZodType<DB.BaseField>;

const selectTypeSchema = baseFieldSchema.extend({
  type: z.literal(DB.FieldType.Select),
  options: z.array(z.string().min(1)).refine((items) => new Set(items).size === items.length, {
    message: "Must be an array of unique options",
  }),
  defaultValue: z.string().optional(),
}) satisfies z.ZodType<SelectField>;

const booleanTypeSchema = baseFieldSchema.extend({
  type: z.literal(DB.FieldType.Boolean),
  defaultValue: z.coerce.boolean().optional(),
}) satisfies z.ZodType<DB.BooleanField>;

export const fieldSchema = z.discriminatedUnion("type", [
  baseFieldSchema.extend({
    type: z.enum([DB.FieldType.Text, DB.FieldType.Number, DB.FieldType.Date]),
    defaultValue: z.string().optional(),
  }) satisfies z.ZodType<DB.EveryField>,
  booleanTypeSchema,
  selectTypeSchema,
]);

export const subCategoriesSchema = z.object({
  name: z.string().min(1).max(255, {
    message: "Must be less than 255 characters",
  }),
  categoryId: z.number().min(1).int().positive(),
  fields: z.array(fieldSchema),
}) satisfies z.ZodType<SubCategory>;

export type SubCategoriesSchema = z.infer<typeof subCategoriesSchema>;
