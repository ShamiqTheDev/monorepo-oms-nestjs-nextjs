import { DB } from "@atdb/types";
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUrl } from "class-validator";
import { Insertable } from "kysely";

export class CreateUserDto implements Insertable<DB.User> {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(DB.Role)
  @IsNotEmpty()
  role: DB.Role;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsUrl()
  avatarUrl: string;
}
