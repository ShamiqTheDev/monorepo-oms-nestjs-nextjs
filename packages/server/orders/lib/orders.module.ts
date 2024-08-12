import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { KyselyModule } from "@atdb/server-kysely";
import { OrdersController } from "./orders.controller";
import { Logger } from "nestjs-pino";
import { CommentsService } from "./comments.service";
import { ConfigModule } from "@atdb/server-config";

@Module({
  imports: [KyselyModule, ConfigModule],
  providers: [Logger, OrdersService, CommentsService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
