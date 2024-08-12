import { ConfigService } from "./config.service";
import { Provider } from "@nestjs/common";
import setup from "./config.setup";

export const configProvider: Provider = {
  provide: ConfigService,
  useFactory() {
    return new ConfigService(setup());
  },
};
