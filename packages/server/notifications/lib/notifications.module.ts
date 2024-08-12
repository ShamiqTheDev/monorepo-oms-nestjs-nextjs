import { Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { KyselyModule } from "@atdb/server-kysely";
import { NotificationsController } from "./notifications.controller";
import { Logger } from "nestjs-pino";

@Module({
  imports: [KyselyModule],
  providers: [Logger, NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
