import { Database, InjectKysely } from "@atdb/server-kysely";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Auth, DB } from "@atdb/types";
import type { Insertable, Kysely, Selectable, Updateable } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import PDFDocument from "pdfkit";
import { type Response } from "express";
import path from "path";
import { format } from "date-fns";
import * as qr from "qrcode";
import { ConfigService, InjectConfig } from "@atdb/server-config";

export interface Order extends Selectable<DB.Order> {
  creator: Selectable<DB.User>;
  category: Selectable<DB.Category>;
  subCategory: Selectable<DB.SubCategory>;
  assignee: Selectable<DB.User>;
  patient: Selectable<DB.Patient>;
  status: Selectable<DB.OrderStatus>;
  location: Selectable<DB.Location>;
  specialist: Selectable<DB.User>;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectKysely() private readonly kysely: Kysely<Database>,
    @InjectConfig() private readonly config: ConfigService
  ) {}

  async createAndPipePdfBlob(res: Response, user: Auth.User, orderId: number) {
    const order = await this.findOne(user, orderId, false);
    if (!order) throw new NotFoundException();

    this.createPDF(res, order as Order);
  }

  private async createPDF(res: Response, order: Order) {
    const staticDirPath = [process.cwd(), "..", "..", "packages", "server", "orders", "static"] as const;
    const fontsDirPath = [...staticDirPath, "fonts"] as const;
    const doc = new PDFDocument({
      font: path.join(...fontsDirPath, "Roboto-Regular.ttf"),
    });

    doc.pipe(res);
    doc.image(path.join(...staticDirPath, "imgs", "logo.png"), 50, 40, { width: 150 });

    const qrcodeImg = await qr.toBuffer(`${this.config.get("hostname")}/peek/${order.id}`);
    doc.image(qrcodeImg, 450, 40, { width: 100 });
    doc.fontSize(16);

    const orderId = `Order #${order.id.toString().padStart(4, "0")}`;
    const textWidth = doc.widthOfString(orderId);

    const labels = [
      "Order ID",
      "Created At",
      "Created By",
      "Patient Name",
      "Simplex Code",
      "Patient Birthdate",
      "Status",
      "Priority",
      "Assignee",
      "Specialist",
      "Location",
      "Category",
      "Sub Category",
      "Delivery Date",
    ];

    const values = [
      order.id.toString(),
      format(new Date(order.createdAt), "dd/MM/yyyy HH:mm"),
      `${order.creator.firstName} ${order.creator.lastName}`,
      order.patient.name,
      order.patient.refId,
      format(new Date(order.patient.birthdate), "dd/MM/yyyy"),
      order.status.label,
      order.priority,
      `${order.assignee.firstName} ${order.assignee.lastName}`,
      `${order.specialist.firstName} ${order.specialist.lastName}`,
      order.location.name,
      order.category.name,
      order.subCategory.name,
      format(new Date(order.deliveryDate), "dd/MM/yyyy"),
    ];

    const xTable = 40;
    const xTableEnd = 550;
    const xLabel = 50;
    const xValue = 150;

    const xPosition = (xTableEnd + xTable - textWidth) / 2;
    let y = 200;

    doc.font(path.join(...fontsDirPath, "Roboto-Bold.ttf")).text(orderId, xPosition, y - 30, { underline: true });
    const rowHeight = 25;
    const fontSize = 10;
    const shadeColor = "#a6b2bf";

    labels.forEach((_, i) => {
      if (i % 2 === 0) {
        doc.rect(xTable, y - 10, xTableEnd - xTable, rowHeight).fill(shadeColor);
      }
      y += rowHeight;
    });

    y = 200;
    doc.fillColor("black");

    doc
      .moveTo(xTable, y - 10)
      .lineTo(xTableEnd, y - 10)
      .stroke();
    doc
      .moveTo(xTable, y - 10)
      .lineTo(xTable, y - 10 + rowHeight * labels.length)
      .stroke();
    doc
      .moveTo(xValue - 10, y - 10)
      .lineTo(xValue - 10, y - 10 + rowHeight * labels.length)
      .stroke();
    doc
      .moveTo(xTableEnd, y - 10)
      .lineTo(xTableEnd, y - 10 + rowHeight * labels.length)
      .stroke();

    labels.forEach((label, i) => {
      doc
        .font(path.join(...fontsDirPath, "Roboto-Bold.ttf"))
        .fontSize(fontSize)
        .text(label, xLabel, y);
      doc.fontSize(fontSize).fillColor("black").text(values[i], xValue, y);
      y += rowHeight;
      doc
        .moveTo(xTable, y - 10)
        .lineTo(xTableEnd, y - 10)
        .stroke();
    });

    doc.end();
  }

  async getAll(user: Auth.User, closed: boolean): Promise<Selectable<DB.Order>[] | undefined> {
    const query = this.kysely
      .selectFrom("orders")
      .selectAll()
      .select((eb) => [
        jsonObjectFrom(eb.selectFrom("users").selectAll("users").whereRef("users.id", "=", "orders.assigneeId")).as("assignee"),
        jsonObjectFrom(eb.selectFrom("users").selectAll("users").whereRef("users.id", "=", "orders.specialistId")).as("specialist"),
        jsonObjectFrom(eb.selectFrom("users").selectAll("users").whereRef("users.id", "=", "orders.createdBy")).as("creator"),
        jsonObjectFrom(
          eb.selectFrom("subcategories").selectAll("subcategories").whereRef("subcategories.id", "=", "orders.subcategoryId")
        ).as("subCategory"),
        jsonObjectFrom(eb.selectFrom("categories").selectAll("categories").whereRef("categories.id", "=", "orders.categoryId")).as(
          "category"
        ),
        jsonObjectFrom(eb.selectFrom("patients").selectAll("patients").whereRef("patients.id", "=", "orders.patientId")).as("patient"),
        jsonObjectFrom(eb.selectFrom("orderStatuses").selectAll("orderStatuses").whereRef("orderStatuses.id", "=", "orders.statusId")).as(
          "status"
        ),
        jsonObjectFrom(eb.selectFrom("locations").selectAll("locations").whereRef("locations.id", "=", "orders.locationId")).as("location"),
      ])
      .where("closed", "is", closed)

    if (user.role === DB.Role.Customer) query.where("createdBy", "=", user.id);

    return await query.execute();
  }

  async findOne(user: Auth.User, id: number, wCommentsAndChanges: boolean): Promise<Selectable<DB.Order> | undefined> {
    const query = this.kysely
      .selectFrom("orders")
      .where("id", "=", id)
      .selectAll()
      .select((eb) => [
        jsonObjectFrom(
          eb.selectFrom("subcategories").selectAll("subcategories").whereRef("subcategories.id", "=", "orders.subcategoryId")
        ).as("subCategory"),
        jsonObjectFrom(eb.selectFrom("categories").selectAll().whereRef("categories.id", "=", "orders.categoryId")).as("category"),
        jsonObjectFrom(eb.selectFrom("users").selectAll().whereRef("users.id", "=", "orders.assigneeId")).as("assignee"),
        jsonObjectFrom(eb.selectFrom("users").selectAll("users").whereRef("users.id", "=", "orders.specialistId")).as("specialist"),
        jsonObjectFrom(eb.selectFrom("users").selectAll().whereRef("users.id", "=", "orders.createdBy")).as("creator"),
        jsonObjectFrom(eb.selectFrom("patients").selectAll("patients").whereRef("patients.id", "=", "orders.patientId")).as("patient"),
        jsonObjectFrom(eb.selectFrom("orderStatuses").selectAll("orderStatuses").whereRef("orderStatuses.id", "=", "orders.statusId")).as(
          "status"
        ),
        jsonObjectFrom(eb.selectFrom("locations").selectAll("locations").whereRef("locations.id", "=", "orders.locationId")).as("location"),
      ]);

    if (user.role === DB.Role.Customer) query.where("createdBy", "=", user.id);

    if (wCommentsAndChanges) {
      return await query.select((eb) => [
        jsonArrayFrom(eb.selectFrom("orderComments").selectAll().select((eb) => [
          jsonObjectFrom(eb.selectFrom("users").selectAll().whereRef("users.id", "=", "orderComments.authorId")).as("author"),
        ]).where("orderComments.orderId", "=", id)).as("comments"),
        jsonArrayFrom(eb.selectFrom("orderChanges").selectAll().select((eb) => [
          jsonObjectFrom(eb.selectFrom("users").selectAll().whereRef("users.id", "=", "orderChanges.initiatorId")).as("initiator"),
        ]).where("orderChanges.orderId", "=", id)).as("changes"),
      ]).executeTakeFirst();
    }
    
    return await query.executeTakeFirst();
  }

  async delete(user: Auth.User, id: number) {
    const query = this.kysely
      .updateTable("orders")
      .set({ deleted: true })
      .where("id", "=", id)

    if (user.role === DB.Role.Customer) query.where("createdBy", "=", user.id);
    else if (user.role === DB.Role.Employee) query.where("assigneeId", "=", user.id);

    return await query.execute();
  }

  async update(user: Auth.User, id: number, data: Updateable<DB.Order>) {
    const query = this.kysely
      .updateTable("orders")
      .set(data)
      .where("id", "=", id)

    if (user.role === DB.Role.Customer) query.where("createdBy", "=", user.id);
    
    await query.execute();
  }

  async create(data: Insertable<DB.Order>) {
    const query = this.kysely.insertInto("orders").values(data);
    return await query.executeTakeFirst();
  }
}
