import { Provider } from "@nestjs/common";
import { Kysely, KyselyConfig } from "kysely";
import { KYSELY_CONFIG, KYSELY_INSTANCE } from "./kysely.constants";

export const kyselyInstanceProvider: Provider = {
  useFactory: (config: KyselyConfig) => new Kysely(config),
  provide: KYSELY_INSTANCE,
  inject: [KYSELY_CONFIG],
};
