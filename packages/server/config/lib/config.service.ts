import { ConfigService as NestConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import setup from "./config.setup";

@Injectable()
export class ConfigService extends NestConfigService<ReturnType<typeof setup>> {}
