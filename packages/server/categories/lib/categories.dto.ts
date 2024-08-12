import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Insertable } from "kysely";
import { DB } from "@atdb/types";

export class CreateCategoryDto implements Insertable<DB.Category> {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
}
