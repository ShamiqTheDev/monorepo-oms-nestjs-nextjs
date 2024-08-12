import { Controller, Delete, Get, HttpCode, HttpStatus, Param, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CurrentUser, Roles } from "@atdb/server-utils";
import { type Auth, DB } from "@atdb/types";
import { Logger } from "nestjs-pino";

@Controller("users")
export class UsersController {
  constructor(
    private readonly logger: Logger,
    private usersService: UsersService
  ) {}

  @Get("me")
  async getMe(@CurrentUser() user: Auth.User) {
    return await this.usersService.findOne(user.id);
  }

  @Get(":userId")
  async getUser(@Param("userId") userId: string) {
    return await this.usersService.findOne(userId);
  }

  @Get()
  async getAll() {
    return await this.usersService.getAll();
  }

  @Roles(...DB.ADMINISTRATIVE_ROLES)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":userId")
  async deleteUser(@CurrentUser() currentUser: Auth.User, @Param("userId") userId: string) {
    const user = await this.usersService.findOne(userId);

    if (Object.values(DB.Role).indexOf(currentUser.role) >= Object.values(DB.Role).indexOf(user.role)) throw new UnauthorizedException();
    await this.usersService.delete(userId);
  }
}
