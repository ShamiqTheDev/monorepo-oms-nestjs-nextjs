import { Module } from "@nestjs/common";
import { SubCategoriesService } from "./sub-categories.service";
import { KyselyModule } from "@atdb/server-kysely";
import { SubCategoriesController } from "./sub-categories.controller";
import { Logger } from "nestjs-pino";

@Module({
  imports: [KyselyModule],
  providers: [Logger, SubCategoriesService],
  controllers: [SubCategoriesController],
  exports: [SubCategoriesService],
})
export class SubCategoriesModule {}
