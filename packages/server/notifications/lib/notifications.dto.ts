import { IsEnum, IsJSON, IsOptional, IsString, IsUUID } from "class-validator";
import { Insertable } from "kysely";
import { DB } from "@atdb/types";

export class CreateNotificationDto implements Omit<Insertable<DB.Notification>, "initiatorId"> {
  @IsString()
  @IsUUID()
  recipientId: string;

  @IsEnum(DB.NotificationAction)
  action: DB.NotificationAction;

  @IsOptional()
  @IsJSON()
  metadata?: string;
}
