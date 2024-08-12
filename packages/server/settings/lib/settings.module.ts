import { Module } from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { KyselyModule } from "@atdb/server-kysely";
import { SettingsController } from "./settings.controller";
import { Logger } from "nestjs-pino";

@Module({
  imports: [KyselyModule],
  providers: [Logger, SettingsService],
  controllers: [SettingsController],
  exports: [SettingsService],
})
export class SettingsModule {}
