import { Database, InjectKysely } from "@atdb/server-kysely";
import { Injectable } from "@nestjs/common";
import { DB } from "@atdb/types";
import { Insertable, Kysely, Selectable } from "kysely";

const NON_SENSETIVE_FIELDS = [
  "createdAt",
  "email",
  "firstName",
  "id",
  "lastName",
  "role",
  "avatarUrl",
  "deleted",
  "defaultLocationId",
] as const satisfies Readonly<(keyof Omit<DB.User, "password">)[]>;

@Injectable()
export class UsersService {
  constructor(@InjectKysely() private readonly kysely: Kysely<Database>) {}

  async findByEmail(email: string): Promise<Selectable<DB.User> | undefined> {
    const query = this.kysely.selectFrom("users").where("email", "=", email).selectAll();

    return await query.executeTakeFirst();
  }

  async findOne(id: string): Promise<Selectable<DB.User> | undefined> {
    const query = this.kysely.selectFrom("users").where("id", "=", id).selectAll();

    return await query.executeTakeFirst();
  }

  async getAll(): Promise<Omit<Selectable<DB.User>, "password">[] | undefined> {
    const query = this.kysely.selectFrom("users").select(NON_SENSETIVE_FIELDS);
    return await query.execute();
  }

  async create(data: Insertable<DB.User>) {
    const query = this.kysely.insertInto("users").values(data);
    await query.executeTakeFirst();
  }

  async delete(id: string) {
    const query = this.kysely
      .updateTable("users")
      .set((eb) => ({ deleted: true, email: eb("email", "||", `+deleted@${Date.now()}`) }))
      .where("id", "=", id);
    await query.executeTakeFirst();
  }

  async updatePassword(id: string, password: string) {
    const query = this.kysely.updateTable("users").set({ password }).where("id", "=", id);
    await query.executeTakeFirst();
  }
}
