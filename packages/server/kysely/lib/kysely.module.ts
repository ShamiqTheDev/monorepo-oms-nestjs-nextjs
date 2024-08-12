import { Module } from "@nestjs/common";
import { ConfigModule } from "@atdb/server-config";
import { Kysely } from "kysely";
import { InjectKysely, KYSELY_INSTANCE } from "./kysely.constants";
import { Database } from "./database.interface";
import { LoggerModule } from "nestjs-pino";
import { kyselyConfigProvider } from "./kysely-config.provider";
import { kyselyInstanceProvider } from "./kysely-instance.provider";

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [kyselyConfigProvider, kyselyInstanceProvider],
  exports: [KYSELY_INSTANCE],
})
export class KyselyModule {
  constructor(@InjectKysely() private readonly kysely: Kysely<Database>) {}

  async onModuleDestroy() {
    await this.kysely.destroy();
  }
}
