import { IsEnum, IsNumber, IsOptional, IsString, validateSync } from "class-validator";
import { Transform, plainToInstance } from "class-transformer";
import { ENV } from "@atdb/types";

export class ENVSchema implements ENV.Api {
  @IsString()
  VITE_DATABASE_USER: string;

  @IsString()
  VITE_DATABASE_PASSWORD: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  VITE_DATABASE_PORT: string;

  @IsString()
  VITE_DATABASE_HOST: string;

  @IsString()
  VITE_DATABASE_NAME: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  VITE_PORT = "3333";

  @IsString()
  VITE_CORS: string;

  @IsEnum(ENV.Environment)
  VITE_NODE_ENV: ENV.Environment;

  @IsString()
  VITE_JWT_SECRET: string;

  @IsString()
  VITE_JWT_EXPIRES_IN: string;

  @IsString()
  VITE_REFRESH_JWT_EXPIRES_IN: string;

  @IsString()
  VITE_RESEND_API_KEY: string;

  @IsString()
  VITE_HOSTNAME: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(ENVSchema, import.meta.env, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
