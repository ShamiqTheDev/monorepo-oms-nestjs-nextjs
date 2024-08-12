import { Provider } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt.guard";
import { APP_GUARD } from "@nestjs/core";

export const jwtGuardProvider: Provider = {
  provide: APP_GUARD,
  useClass: JwtAuthGuard,
};
