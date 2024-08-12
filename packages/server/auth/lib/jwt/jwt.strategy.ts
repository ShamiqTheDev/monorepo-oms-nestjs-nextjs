import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService, InjectConfig } from "@atdb/server-config";
import { JwtUserPayload } from "../local.types";
import { Auth } from "@atdb/types";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectConfig() private readonly configService: ConfigService,
    @InjectPinoLogger() private readonly logger: PinoLogger
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("jwt.secret", { infer: true }),
    });
  }

  async validate(payload: JwtUserPayload): Promise<Auth.User> {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
