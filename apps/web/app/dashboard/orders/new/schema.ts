import { DB } from "@atdb/types";
import { Insertable } from "kysely";
import { z } from "zod";

export interface FormOrder
  extends Omit<Insertable<DB.Order>, "createdBy" | "status" | "illuminatedPhotos" | "assigneeId" | "metadata" | "patientId"> {
  metadata: DB.OrderMetadata;
}

const orderMetadataFieldSchema = z.object({
  name: z.string().min(1).max(255, {
    message: "Must be less than 255 characters",
  }),
  value: z.union([z.string(), z.number(), z.boolean()]),
});

const orderMetadataSchema = z.object({
  fields: z.array(orderMetadataFieldSchema),
});

export const orderSchema = z.strictObject({
  patientId: z.coerce.number().optional(),
  patientOwnerId: z.string().uuid().optional(),
  patientRef: z.string(),
  patientName: z.string(),
  patientBirthdate: z.string(),
  specialistId: z.string().uuid(),
  locationId: z.number().min(1).int().positive(),
  deliveryDate: z.string(),
  categoryId: z.number().min(1).int().positive(),
  subcategoryId: z.number().min(1).int().positive(),
  specificDetails: z.string().optional(),
  imagesAttached: z.boolean(),
  priority: z.nativeEnum(DB.Priority, {
    invalid_type_error: "Please select a priority",
  }),
  illuminatedPhotos: z.array(z.instanceof(Blob)).optional(),
  metadata: orderMetadataSchema,
});

export type OrderSchema = z.infer<typeof orderSchema>;
