import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { KyselyModule } from "@atdb/server-kysely";
import { UsersController } from "./users.controller";
import { Logger } from "nestjs-pino";

@Module({
  imports: [KyselyModule],
  providers: [Logger, UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
