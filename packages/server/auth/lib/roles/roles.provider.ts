import { Provider } from "@nestjs/common";
import { RolesGuard } from "./roles.guard";
import { APP_GUARD } from "@nestjs/core";

export const rolesGuardProvider: Provider = {
  provide: APP_GUARD,
  useClass: RolesGuard,
};
