import { Database, InjectKysely } from "@atdb/server-kysely";
import { ConflictException, Injectable } from "@nestjs/common";
import { DB } from "@atdb/types";
import type { Insertable, Kysely, Selectable } from "kysely";

@Injectable()
export class SubCategoriesService {
  constructor(@InjectKysely() private readonly kysely: Kysely<Database>) {}

  async create(data: Insertable<DB.SubCategory>) {
    if (
      await this.kysely
        .selectFrom("subcategories")
        .where("categoryId", "=", data.categoryId)
        .where("name", "=", data.name)
        .where("deleted", "=", false)
        .selectAll()
        .executeTakeFirst()
    ) {
      throw new ConflictException("Sub category already exists");
    }

    const query = this.kysely.insertInto("subcategories").values(data);
    await query.execute();
  }

  async delete(id: number) {
    const query = this.kysely.updateTable("subcategories").set({ deleted: true }).where("id", "=", id);
    await query.execute();
  }

  async getAll(): Promise<Selectable<DB.SubCategory>[] | undefined> {
    const query = this.kysely.selectFrom("subcategories").selectAll();
    return await query.execute();
  }
}
