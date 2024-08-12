import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { Insertable } from "kysely";
import { DB } from "@atdb/types";

export class CreateFieldDto implements Insertable<DB.Field> {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  defaultValue: string;

  @IsEnum(DB.FieldType)
  type: DB.FieldType;

  @IsBoolean()
  required: boolean;
}

export class CreateSubCategoryDto implements Insertable<DB.Category> {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNumber()
  @Min(1)
  categoryId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFieldDto)
  @IsOptional()
  fields: DB.Field[] = [];
}
