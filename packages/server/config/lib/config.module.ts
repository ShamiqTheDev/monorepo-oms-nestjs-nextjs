import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { configProvider } from "./config.provider";
import { ConfigService } from "./config.service";
import { Global, Module } from "@nestjs/common";
import { validate } from "./config.validate";
import setup from "./config.setup";

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      validate,
      load: [setup],
    }),
  ],
  providers: [configProvider],
  exports: [ConfigService],
})
export class ConfigModule {}
