import { Database, InjectKysely } from "@atdb/server-kysely";
import { Insertable, Kysely, Selectable } from "kysely";
import { Injectable } from "@nestjs/common";
import { DB } from "@atdb/types";

@Injectable()
export class PatientsService {
  constructor(@InjectKysely() private readonly kysely: Kysely<Database>) {}

  async getAll(ownerId: DB.Patient['ownerId']) {
    let query = this.kysely.selectFrom("patients").selectAll();
    if (ownerId) query = query.where("ownerId", "=", ownerId);
    return await query.execute();
  }

  async createBulk(data: Insertable<DB.Patient>[]) {
    for (let i = 0; i < data.length; i += 1) {
      if (i % 3000 !== 0) continue;

      await this.kysely
        .insertInto("patients")
        .values(data.slice(i, i + 3000))
        .onConflict((oc) =>
          oc.column("id").doUpdateSet((eb) => ({ name: eb.ref("excluded.name"), birthdate: eb.ref("excluded.birthdate") }))
        )
        .execute();
    }
  }

  async findOne(id: number): Promise<Selectable<DB.Patient>> {
    const query = this.kysely.selectFrom("patients").selectAll().where("id", "=", id);
    return await query.executeTakeFirst();
  }

  async findOneByRef(id: string, ownerId: DB.Patient['ownerId']): Promise<Selectable<DB.Patient>> {
    const op = ownerId === null? "is": "=";
    const query = this.kysely.selectFrom("patients").selectAll().where("refId", "=", id).where("ownerId", op, ownerId);
    return await query.executeTakeFirst();
  }

  async create(data: Insertable<DB.Patient>): Promise<{ id: number }> {
    const query = this.kysely.insertInto("patients").values(data).returning("id");
    return await query.executeTakeFirst();
  }

  async deleteAll(ownerId: DB.Patient['ownerId']) {
    const op = ownerId === null? "is": "=";
    const query = this.kysely.deleteFrom("patients").where("patients.id", "not in", (qb) => qb.selectFrom("orders").where("ownerId", op, ownerId).select("patientId"));
    await query.execute();
  }
}
