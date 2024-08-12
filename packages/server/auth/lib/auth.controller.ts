import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { JwtRefreshGuard } from "./refresh/refresh.guard";
import { CurrentUser, AllowAnon } from "@atdb/server-utils";
import { type Auth } from "@atdb/types";

@AllowAnon()
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@CurrentUser() user: Auth.SessionUser): Promise<Auth.LoginPayload> {
    const secrets = await this.authService.login(user);

    return { user, secrets };
  }

  @UseGuards(JwtRefreshGuard)
  @Post("refresh")
  async refresh(@CurrentUser() user: Auth.User) {
    return await this.authService.refreshToken(user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("request-password-reset")
  async requestPasswordReset(@Body("email") email: string) {
    await this.authService.requestPasswordReset(email);
    return { message: "Password reset email sent" };
  }

  @HttpCode(HttpStatus.OK)
  @Post("reset-password")
  async resetPassword(@Body("token") token: string, @Body("newPassword") newPassword: string) {
    await this.authService.resetPassword(token, newPassword);
    return { message: "Password reset successful" };
  }
}
