import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { OrderChangesService } from "./order-changes.service";
import { CreateOrderChangeDto } from "./order-changes.dto";

@Controller("order-changes")
export class OrderChangesController {
  constructor(
    private orderChangesService: OrderChangesService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCategory(@Body() orderChange: CreateOrderChangeDto) {
    await this.orderChangesService.create(orderChange);
  }
}
