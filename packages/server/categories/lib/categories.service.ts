import { Database, InjectKysely } from "@atdb/server-kysely";
import { ConflictException, Injectable } from "@nestjs/common";
import { DB } from "@atdb/types";
import type { Insertable, Kysely, Selectable } from "kysely";

@Injectable()
export class CategoriesService {
  constructor(@InjectKysely() private readonly kysely: Kysely<Database>) {}

  async create(data: Insertable<DB.Category>) {
    if (
      await this.kysely.selectFrom("categories").where("deleted", "=", false).where("name", "=", data.name).selectAll().executeTakeFirst()
    ) {
      throw new ConflictException("Category already exists");
    }

    const query = this.kysely.insertInto("categories").values(data);
    await query.execute();
  }

  async delete(id: number) {
    const categoriesQuery = this.kysely.updateTable("categories").set({ deleted: true }).where("id", "=", id);
    const subCategoriesQuery = this.kysely.updateTable("subcategories").set({ deleted: true }).where("categoryId", "=", id);

    await categoriesQuery.execute();
    await subCategoriesQuery.execute();
  }

  async getAll(): Promise<Selectable<DB.Category>[] | undefined> {
    const query = this.kysely.selectFrom("categories").selectAll();
    return await query.execute();
  }
}
