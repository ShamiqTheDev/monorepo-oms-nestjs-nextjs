import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { SubCategoriesService } from "./sub-categories.service";
import { Logger } from "nestjs-pino";
import { DB } from "@atdb/types";
import { Insertable, Selectable } from "kysely";
import { CreateSubCategoryDto } from "./sub-categories.dto";
import { Roles } from "@atdb/server-utils";

@Controller("sub-categories")
export class SubCategoriesController {
  constructor(
    private readonly logger: Logger,
    private subCategoriesService: SubCategoriesService
  ) {}

  @Post()
  @Roles(...DB.ADMINISTRATIVE_ROLES)
  @HttpCode(HttpStatus.CREATED)
  async createSubCategory(@Body() category: CreateSubCategoryDto) {
    const insertableCategory: Insertable<DB.SubCategory> = {
      ...category,
      fields: JSON.stringify(category.fields),
    };

    await this.subCategoriesService.create(insertableCategory);
  }

  @Get()
  async getSubCategories(): Promise<Selectable<DB.SubCategory>[] | undefined> {
    const categories = await this.subCategoriesService.getAll();
    return categories;
  }

  @Delete(":categoryId")
  @Roles(...DB.ADMINISTRATIVE_ROLES)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSubCategory(@Param("categoryId") categoryId: number) {
    await this.subCategoriesService.delete(categoryId);
  }
}
