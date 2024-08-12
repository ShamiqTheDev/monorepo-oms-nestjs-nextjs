import { Module } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { KyselyModule } from "@atdb/server-kysely";
import { CategoriesController } from "./categories.controller";
import { Logger } from "nestjs-pino";

@Module({
  imports: [KyselyModule],
  providers: [Logger, CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
