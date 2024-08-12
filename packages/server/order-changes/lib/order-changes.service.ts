import { Database, InjectKysely } from "@atdb/server-kysely";
import { Injectable } from "@nestjs/common";
import { Auth, DB } from "@atdb/types";
import type { Insertable, Kysely } from "kysely";
@Injectable()
export class OrderChangesService {
  constructor(
    @InjectKysely() private readonly kysely: Kysely<Database>,
    // private ordersService: OrdersService,
  ) {}

  async create(data: Insertable<DB.OrderChange>) {
    const query = this.kysely.insertInto("orderChanges").values(data);
    await query.execute();
  }

  async delete(user: Auth.User, id: number) {
    const query = this.kysely.deleteFrom("orderChanges").where("id", "=", id).where("initiatorId", "=", user.id);
    await query.execute();
  }

  // async getAll(user: Auth.User, id: number): Promise<Selectable<DB.OrderChange>[] | undefined> {
  //   if (user.role === DB.Role.Customer) {
  //     const order = await this.ordersService.findOne(user, id);
  //     if (!order) throw new NotFoundException();
  //   }
  //   const query = this.kysely
  //     .selectFrom("orderChanges")
  //     .selectAll()
  //     .where("orderId", "=", id)
  //     .select((eb) => [
  //       jsonObjectFrom(eb.selectFrom("users").selectAll("users").whereRef("users.id", "=", "orderChanges.initiatorId")).as("initiator"),
  //     ]);
  //   return await query.execute();
  // }
}
