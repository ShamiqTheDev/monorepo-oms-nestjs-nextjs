import { InvitationsController } from "./invitations.controller";
import { InvitationsService } from "./invitations.service";
import { KyselyModule } from "@atdb/server-kysely";
import { Module } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { UsersModule } from "@atdb/server-users";
import { ConfigModule } from "@atdb/server-config";

@Module({
  imports: [ConfigModule, UsersModule, KyselyModule],
  providers: [Logger, InvitationsService],
  controllers: [InvitationsController],
  exports: [InvitationsService],
})
export class InvitationsModule {}
