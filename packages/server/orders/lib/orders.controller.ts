import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, HttpStatus, Param, ParseBoolPipe, Patch, Post, Query, Response } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { type Auth, DB } from "@atdb/types";
import type { Insertable, Selectable, Updateable } from "kysely";
import { CommentsService } from "./comments.service";
import { CurrentUser } from "@atdb/server-utils";
import { type Response as EResponse } from "express";

@Controller("orders")
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private commentsService: CommentsService
  ) {}
  
  @Get()
  async getOrders(@CurrentUser() user: Auth.User, @Query("closed", new DefaultValuePipe(false), ParseBoolPipe) closed: boolean): Promise<Selectable<DB.Order>[] | undefined> {
    return this.ordersService.getAll(user, closed);
  }

  @Get(":orderId")
  async getOrder(@CurrentUser() user: Auth.User, @Param("orderId") orderId: number, @Query("wCommentsAndChanges", new DefaultValuePipe(false), ParseBoolPipe) wCommentsAndChanges: boolean): Promise<Selectable<DB.Order> | undefined>  {
    return this.ordersService.findOne(user, orderId, wCommentsAndChanges);
  }

  @Get(":orderId/pdf")
  async pipeOrderPdf(@Response() res: EResponse, @CurrentUser() user: Auth.User, @Param("orderId") orderId: number) {
    await this.ordersService.createAndPipePdfBlob(res, user, orderId);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=example.pdf");
  }

  // @Get(":orderId/comments")
  // async getOrderComments(@Param("orderId") orderId: number) {
  //   return this.commentsService.getAll(orderId);
  // }

  @HttpCode(HttpStatus.CREATED)
  @Post("comments")
  async createOrderComment(@CurrentUser() user: Auth.User, @Body() comment: Insertable<DB.OrderComment>) {
    await this.commentsService.create(user, comment);
  }

  @Delete(":orderId")
  async deleteOrder(@CurrentUser() user: Auth.User, @Param("orderId") orderId: number) {
    return this.ordersService.delete(user, orderId);
  }

  @Delete("comments/:commentId")
  async deleteComment(@CurrentUser() user: Auth.User, @Param("commentId") commentId: number) {
    return this.commentsService.delete(user, commentId);
  }

  @Patch(":orderId")
  async updateOrder(@CurrentUser() user: Auth.User, @Param("orderId") orderId: number, @Body() updatedOrder: Updateable<DB.Order>) {
    return this.ordersService.update(user, orderId, updatedOrder);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOrder(@Body() createOrderDto): Promise<void> {
    await this.ordersService.create(createOrderDto as Insertable<DB.Order>);
  }
}
