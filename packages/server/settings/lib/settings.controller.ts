import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { Logger } from "nestjs-pino";
import { DB } from "@atdb/types";
import { Selectable } from "kysely";
import { CreateAppSettingsDto } from "./settings.dto";
import { AllowAnon, Roles } from "@atdb/server-utils";

@Controller("settings")
export class SettingsController {
  constructor(
    private readonly logger: Logger,
    private settingsService: SettingsService
  ) {}

  @Post()
  @Roles(DB.Role.Superadmin, DB.Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  async updateSettings(@Body() appSettings: CreateAppSettingsDto) {
    await this.settingsService.update(appSettings);
  }

  @AllowAnon()
  @Get()
  async getSettings(): Promise<Selectable<DB.AppSettings> | undefined> {
    const settings = await this.settingsService.get();
    return settings;
  }
}
