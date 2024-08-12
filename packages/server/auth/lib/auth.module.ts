import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfigService } from "@atdb/server-config";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { UsersModule } from "@atdb/server-users";
import { jwtGuardProvider } from "./jwt/jwt-guard.provider";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./auth.strategy";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { JwtRefreshStrategy } from "./refresh/refresh.strategy";
import { rolesGuardProvider } from "./roles/roles.provider";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get("jwt.secret", { infer: true }),
          global: true,
          signOptions: { expiresIn: config.get("jwt.expires_in", { infer: true }) },
        };
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy, jwtGuardProvider, rolesGuardProvider],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
