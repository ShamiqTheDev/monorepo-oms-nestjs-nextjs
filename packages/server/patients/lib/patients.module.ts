import { PatientsController } from "./patients.controller";
import { PatientsService } from "./patients.service";
import { KyselyModule } from "@atdb/server-kysely";
import { Module } from "@nestjs/common";
import { Logger } from "nestjs-pino";

@Module({
  imports: [KyselyModule],
  providers: [Logger, PatientsService],
  controllers: [PatientsController],
  exports: [PatientsService],
})
export class PatientsModule {}
