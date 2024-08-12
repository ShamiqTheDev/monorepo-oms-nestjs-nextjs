import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoggerModule } from "nestjs-pino";
import { ConfigModule, ConfigService } from "@atdb/server-config";
import { UsersModule } from "@atdb/server-users";
import { OrdersModule } from "@atdb/server-orders";
import { AuthModule } from "@atdb/server-auth";
import { InvitationsModule } from "@atdb/server-invitations";
import { CategoriesModule } from "@atdb/server-categories";
import { SubCategoriesModule } from "@atdb/server-sub-categories";
import { OrderChangesModule } from "@atdb/server-order-changes";
import { NotificationsModule } from "@atdb/server-notifications";
import { PatientsModule } from "@atdb/server-patients";
import { SettingsModule } from "@atdb/server-settings";
import { ENV } from "@atdb/types";

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: [
          {
            level: config.get("node_env", { infer: true }) !== ENV.Environment.Production ? "debug" : "info",
            transport: config.get("node_env", { infer: true }) !== ENV.Environment.Production ? { target: "pino-pretty" } : undefined,
          },
          process.stdout,
        ],
      }),
    }),
    UsersModule,
    OrdersModule,
    AuthModule,
    InvitationsModule,
    CategoriesModule,
    SubCategoriesModule,
    OrderChangesModule,
    NotificationsModule,
    PatientsModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
