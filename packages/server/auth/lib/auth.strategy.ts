import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Auth } from "@atdb/types";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<Auth.SessionUser | never> {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
