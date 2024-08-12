import { Inject } from "@nestjs/common";
import { ConfigService } from "./config.service";

export const CONFIG_INSTANCE = Symbol("CONFIG_INSTANCE");
export const InjectConfig = () => Inject(ConfigService);
