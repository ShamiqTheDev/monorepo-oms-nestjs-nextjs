import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateInvitationUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  password: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  defaultLocationId: number;
}
