import { Database, InjectKysely } from "@atdb/server-kysely";
import { Injectable } from "@nestjs/common";
import { DB } from "@atdb/types";
import type { Insertable, Kysely, Selectable } from "kysely";
import { Category, SubCategory } from "@atdb/types/db";

@Injectable()
export class SettingsService {
  constructor(@InjectKysely() private readonly kysely: Kysely<Database>) {}

  async deleteAllOrderStatuses() {
    const query = this.kysely.updateTable("orderStatuses").set({ deleted: true }).where("id", ">", 1);
    await query.execute();
  }

  async deleteAllLocations() {
    const query = this.kysely.updateTable("locations").set({ deleted: true });
    await query.execute();
  }

  async createOrderStatuses(data: Insertable<DB.OrderStatus>[]) {
    const insertQuery = this.kysely
      .insertInto("orderStatuses")
      .values(data)
      .onConflict((oc) => oc.column("label").doUpdateSet({ deleted: false }))
      .returning("id");

    const insertedRows = await insertQuery.execute();
    const updatePrevRowsQuery = this.kysely
      .updateTable("orderStatuses")
      .set({ deleted: true })
      .where("id", ">", 1)
      .where(
        "id",
        "not in",
        insertedRows.map((r) => r.id)
      );
    await updatePrevRowsQuery.execute();
  }

  async createLocations(data: Insertable<DB.Location>[]) {
    const insertQuery = this.kysely
      .insertInto("locations")
      .values(data)
      .onConflict((oc) => oc.column("name").doUpdateSet({ deleted: false }))
      .returning("id");

    const insertedRows = await insertQuery.execute();
    const updatePrevRowsQuery = this.kysely
      .updateTable("locations")
      .set({ deleted: true })
      .where(
        "id",
        "not in",
        insertedRows.map((r) => r.id)
      );

    await updatePrevRowsQuery.execute();
  }

  async update(data: Insertable<DB.AppSettings>) {
    if (data.orderStatuses.length > 0) await this.createOrderStatuses(data.orderStatuses);
    else await this.deleteAllOrderStatuses();

    if (data.locations.length > 0) await this.createLocations(data.locations);
    else await this.deleteAllLocations();
  }

  async get(): Promise<Selectable<DB.AppSettings> | undefined> {
    const queries = [
      this.kysely.selectFrom("orderStatuses").selectAll().where("deleted", "=", false).execute(),
      this.kysely.selectFrom("locations").selectAll().where("deleted", "=", false).execute(),
      this.kysely.selectFrom("categories").select(["id", "name"]).where("deleted", "=", false).execute(),
      this.kysely.selectFrom("subcategories").select(["id", "name"]).where("deleted", "=", false).execute(),
    ];

    const [orderStatuses, locations, categories, subCategories] = (await Promise.all(queries)) as [
      Selectable<DB.OrderStatus>[],
      Selectable<DB.Location>[],
      Selectable<Omit<Category, "deleted">>[],
      Selectable<Omit<SubCategory, "deleted" | "categoryId" | "fields">>[],
    ];
    return { orderStatuses, locations, categories, subCategories };
  }
}
