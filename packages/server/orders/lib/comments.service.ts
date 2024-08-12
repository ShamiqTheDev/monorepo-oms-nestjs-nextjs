import { Database, InjectKysely } from "@atdb/server-kysely";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Auth, DB } from "@atdb/types";
import type { Insertable, Kysely, Updateable } from "kysely";
import { OrdersService } from "./orders.service";

@Injectable()
export class CommentsService {
  constructor(
    @InjectKysely() private readonly kysely: Kysely<Database>,
    private ordersService: OrdersService,
  ) {}

  async delete(user: Auth.User, id: number) {
    const query = this.kysely.deleteFrom("orderComments").where("id", "=", id).where("authorId", "=", user.id).returningAll();
    return await query.executeTakeFirst();
  }

  async update(user: Auth.User, id: number, data: Updateable<DB.OrderComment>) {
    const query = this.kysely.updateTable("orderComments").set(data).where("id", "=", id).where("authorId", "=", user.id);
    await query.execute();
  }

  async create(user: Auth.User, data: Insertable<DB.OrderComment>) {
    if (user.role === DB.Role.Customer) {
      const order = await this.ordersService.findOne(user, data.orderId, false);
      if (!order) throw new NotFoundException();
    }
    const query = this.kysely.insertInto("orderComments").values(data);
    await query.execute();
  }
}
