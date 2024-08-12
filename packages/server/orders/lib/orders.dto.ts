import { IsUUID, IsEnum, IsNumber, IsOptional, IsPositive, IsString, Min, IsArray, IsISO8601, IsJSON } from "class-validator";
import { Insertable } from "kysely";
import { type Order, Priority } from "@atdb/types/db";

// export class CreateMetadataFieldDto implements Insertable<DB.OrderMetadataField> {
//   @IsNotEmpty()
//   @IsString()
//   @MaxLength(255)
//   name: string;

//   value: string | number | boolean;
// }

// type RemoveIndex<T> = {
//   [K in keyof T as {} extends Record<K, 1> ? never : K]: T[K];
// };

// export class CreateMetadataDto implements RemoveIndex<Insertable<DB.OrderMetadata>> {
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => CreateMetadataFieldDto)
//   @IsOptional()
//   fields: DB.OrderMetadataField[] = [];
// }

export class CreateOrderDto implements Insertable<Order> {
  @IsString()
  @IsUUID()
  createdBy: string;

  @IsNumber()
  @Min(1)
  @IsPositive()
  patientId: number;

  @IsString()
  @IsUUID()
  specialistId: string;

  @IsNumber()
  @Min(1)
  @IsPositive()
  locationId: number;

  @IsISO8601()
  deliveryDate: string;

  @IsString()
  @IsUUID()
  assigneeId: string;

  @IsNumber()
  @Min(1)
  @IsPositive()
  categoryId: number;

  @IsNumber()
  @Min(1)
  @IsPositive()
  subcategoryId: number;

  @IsEnum(Priority)
  priority: Priority;

  @IsNumber()
  @Min(1)
  @IsPositive()
  statusId: number;

  specificDetails?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  illuminatedPhotos: string[];

  @IsOptional()
  @IsJSON()
  metadata?: string;
}
