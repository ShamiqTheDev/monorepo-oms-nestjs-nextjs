import { IsJSON, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Min } from "class-validator";
import { Insertable } from "kysely";
import { DB } from "@atdb/types";

export class CreateOrderChangeDto implements Insertable<DB.OrderChange> {
  @IsNumber()
  @Min(1)
  @IsPositive()
  orderId: number;

  @IsString()
  @IsUUID()
  initiatorId: string;

  @IsString()
  @IsOptional()
  @IsJSON()
  changedFields?: string;
}
