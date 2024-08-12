import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import { InvitationsService } from "./invitations.service";
import type { Insertable } from "kysely";
import { type Auth, DB } from "@atdb/types";
import { AllowAnon, CurrentUser, Roles } from "@atdb/server-utils";
import { UsersService } from "@atdb/server-users";
import * as argon2 from "@node-rs/argon2";
import { CreateInvitationUserDto } from "./invitations.dto";

@Controller("invitations")
export class InvitationsController {
  constructor(
    private readonly usersService: UsersService,
    private invitationsService: InvitationsService
  ) {}

  @AllowAnon()
  @Get(":invitationId")
  async getInvitation(@Param("invitationId") invitationId: string) {
    const invite = await this.invitationsService.findOne(invitationId);
    if (!invite) throw new NotFoundException();

    return invite;
  }

  @AllowAnon()
  @Post("accept/:invitationId")
  @HttpCode(HttpStatus.CREATED)
  async useInvite(
    @Req() req: Request,
    @Param("invitationId") invitationId: string,
    @Body() createInvitationUserDto: CreateInvitationUserDto
  ) {
    if (req.user) throw new BadRequestException();

    const invite = await this.invitationsService.findOne(invitationId);
    if (!invite) throw new NotFoundException("Invalid invitation");

    const hashedPassword = await argon2.hash(createInvitationUserDto.password);
    const user: Insertable<DB.User> = {
      firstName: createInvitationUserDto.firstName,
      lastName: createInvitationUserDto.lastName,
      defaultLocationId: createInvitationUserDto.defaultLocationId,
      password: hashedPassword,
      email: invite.email,
      role: invite.role,
    };

    await this.invitationsService.accept(invitationId, { email: user.email, role: user.role });
    await this.usersService.create(user);
  }

  @Post()
  @Roles(...DB.ADMINISTRATIVE_ROLES)
  @HttpCode(HttpStatus.CREATED)
  async createInvitation(@CurrentUser() user: Auth.User, @Body() data: Insertable<DB.Invitation>) {
    if (Object.values(DB.Role).indexOf(user.role) >= Object.values(DB.Role).indexOf(data.role)) throw new UnauthorizedException();
    data!.email = data!.email.toLowerCase();
    await this.invitationsService.send(data);
  }
}
