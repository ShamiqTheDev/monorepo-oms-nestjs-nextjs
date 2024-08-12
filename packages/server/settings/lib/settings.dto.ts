import { IsArray, IsEnum, IsString, ValidateNested } from "class-validator";
import { Insertable } from "kysely";
import { DB } from "@atdb/types";
import { Type } from "class-transformer";

class OrderStatusDto implements Insertable<DB.OrderStatus> {
  @IsString()
  label: string;

  @IsString()
  color: string;
}

class LocationDto implements Insertable<DB.Location> {
  @IsString()
  name: string;
}

export class CreateAppSettingsDto implements Insertable<DB.AppSettings> {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderStatusDto)
  orderStatuses: Insertable<DB.OrderStatus>[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocationDto)
  locations: Insertable<DB.Location>[];
}
