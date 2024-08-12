import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "@atdb/server-users";
import { JwtService } from "@nestjs/jwt";
import { Auth } from "@atdb/types";
import * as argon2 from "@node-rs/argon2";
import { JwtUserPayload } from "./local.types";
import { ConfigService, InjectConfig } from "@atdb/server-config";
import { ACCESS_TOKEN_EXPIRY } from "./auth.constants";
import { Resend } from "resend";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectConfig() private configService: ConfigService
  ) {}

  private generateExpirationDate() {
    return new Date().setTime(new Date().getTime() + ACCESS_TOKEN_EXPIRY);
  }

  async validateUser(email: string, pass: string): Promise<Auth.SessionUser | undefined> {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.deleted) throw new NotFoundException();

    const doesPasswordsMatch = await argon2.verify(user.password, pass);
    if (!doesPasswordsMatch) throw new UnauthorizedException();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.deleted) throw new NotFoundException();

    const token = this.jwtService.sign({ email }, { expiresIn: "1h" });
    const resend = new Resend(this.configService.get("resend_api_key", { infer: true }));

    await resend.emails.send({
      from: "no-reply@emails.dentalzorg.com",
      to: email,
      subject: "Dentalzorg - Reset Password",
      html: `<div><h1>You have requested to reset your password (the link is valid for 1 hour)</h1><a href="${this.configService.get("hostname", {
        infer: true,
      })}/reset-password?t=${token}">Reset Password</a></div>`,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const payload = this.jwtService.verify(token);
    const user = await this.usersService.findByEmail(payload.email);
    if (!user || user.deleted) throw new NotFoundException();

    const hashedPassword = await argon2.hash(newPassword);
    await this.usersService.updatePassword(user.id, hashedPassword);
  }

  async login(user: Auth.SessionUser): Promise<Auth.Secrets> {
    const payload: JwtUserPayload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: this.configService.get("jwt.refresh_expires_in", { infer: true }),
      }),
      expires_in: this.generateExpirationDate(),
    };
  }

  async refreshToken(user: Auth.User): Promise<Auth.RefreshPayload> {
    const payload: JwtUserPayload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      expires_in: this.generateExpirationDate(),
    };
  }
}
