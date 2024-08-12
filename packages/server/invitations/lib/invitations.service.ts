import { Database, InjectKysely } from "@atdb/server-kysely";
import { Insertable, Kysely } from "kysely";
import { BadRequestException, GoneException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { DB } from "@atdb/types";
import { Resend } from "resend";
import { ConfigService, InjectConfig } from "@atdb/server-config";

const EXPIRY_TIME = 1000 * 60 * 60 * 24;

@Injectable()
export class InvitationsService {
  private resend: Resend;
  constructor(
    @InjectKysely() private readonly kysely: Kysely<Database>,
    @InjectConfig() private readonly config: ConfigService
  ) {
    this.resend = new Resend(config.get("resend_api_key", { infer: true }));
  }

  async accept(id: string, user: { email: string; role: DB.Role }) {
    const invitation = await this.findOne(id);
    if (!invitation) throw new NotFoundException();
    if (new Date().getTime() >= new Date(invitation.createdAt).getTime() + EXPIRY_TIME) throw new GoneException();
    if (invitation.email !== user.email || invitation.role !== user.role) throw new UnauthorizedException();

    await this.delete(id);
  }

  async send(data: Insertable<DB.Invitation>) {
    if (data.role === DB.Role.Superadmin) throw new BadRequestException();
    const oldInvite = await this.findOneByEmail(data.email);
    if (oldInvite) {
      await this.delete(oldInvite.id);
    }
    const invite = await this.create(data);

    await this.resend.emails.send({
      from: "invitations@emails.dentalzorg.com",
      to: data.email,
      subject: "Dentalzorg - Invitation",
      html: `<div><h1>You have been invited to DentalZorg's System!</h1><a href="${this.config.get("hostname", {
        infer: true,
      })}accept-invite/${invite.id}">Accept Invite</a>. The link is valid for 24 hours only!</div>`,
    });
  }

  async findOne(id: string) {
    const invite = await this.kysely.selectFrom("invitations").where("id", "=", id).selectAll().executeTakeFirst();
    if (!invite) return invite;
    if (new Date().getTime() >= new Date(invite.createdAt).getTime() + EXPIRY_TIME) {
      await this.delete(invite.id);
      throw new GoneException();
    };
    return invite;
  }

  async findOneByEmail(email: string) {
    const invite = await this.kysely.selectFrom("invitations").where("email", "=", email).selectAll().executeTakeFirst();
    if (!invite) return invite;
    if (new Date().getTime() >= new Date(invite.createdAt).getTime() + EXPIRY_TIME) {
      await this.delete(invite.id);
      throw new GoneException();
    };
    return invite;
  }

  async getAll() {
    const query = this.kysely.selectFrom("invitations").selectAll();
    return await query.execute();
  }

  async create(data: Insertable<DB.Invitation>) {
    const query = this.kysely.insertInto('invitations').values(data).returning('id');
    return query.executeTakeFirst();
  }

  async delete(id: string) {
    const query = this.kysely.deleteFrom("invitations").where("id", "=", id);
    await query.execute();
  }
}
