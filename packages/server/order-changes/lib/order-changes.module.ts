import { Module } from "@nestjs/common";
import { OrderChangesService } from "./order-changes.service";
import { KyselyModule } from "@atdb/server-kysely";
import { OrderChangesController } from "./order-changes.controller";
import { Logger } from "nestjs-pino";

@Module({
  imports: [KyselyModule],
  providers: [Logger, OrderChangesService],
  controllers: [OrderChangesController],
  exports: [OrderChangesService],
})
export class OrderChangesModule {}
