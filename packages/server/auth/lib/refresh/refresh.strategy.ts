import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService, InjectConfig } from "@atdb/server-config";
import { JwtUserPayload } from "../local.types";
import { Auth } from "@atdb/types";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(@InjectConfig() private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("refresh_token"),
      secretOrKey: configService.get("jwt.secret", { infer: true }),
    });
  }

  async validate(payload: JwtUserPayload): Promise<Auth.User> {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
