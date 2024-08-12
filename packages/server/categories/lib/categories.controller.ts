import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { Logger } from "nestjs-pino";
import { DB } from "@atdb/types";
import { Selectable } from "kysely";
import { CreateCategoryDto } from "./categories.dto";
import { Roles } from "@atdb/server-utils";

@Controller("categories")
export class CategoriesController {
  constructor(
    private readonly logger: Logger,
    private categoriesService: CategoriesService
  ) {}

  @Post()
  @Roles(...DB.ADMINISTRATIVE_ROLES)
  @HttpCode(HttpStatus.CREATED)
  async createCategory(@Body() category: CreateCategoryDto) {
    await this.categoriesService.create(category);
  }

  @Get()
  async getCategories(): Promise<Selectable<DB.Category>[] | undefined> {
    const categories = await this.categoriesService.getAll();
    return categories;
  }

  @Delete(":categoryId")
  @Roles(...DB.ADMINISTRATIVE_ROLES)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(@Param("categoryId") categoryId: number) {
    await this.categoriesService.delete(categoryId);
  }
}
