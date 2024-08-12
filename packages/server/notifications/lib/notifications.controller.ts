import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { Logger } from "nestjs-pino";
import { type Auth, DB } from "@atdb/types";
import { Selectable } from "kysely";
import { CreateNotificationDto } from "./notifications.dto";
import { CurrentUser } from "@atdb/server-utils";

@Controller("notifications")
export class NotificationsController {
  constructor(
    private readonly logger: Logger,
    private notificationsService: NotificationsService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createNotification(@CurrentUser() currentUser: Auth.User, @Body() notification: CreateNotificationDto[]) {
    await this.notificationsService.createByUser(notification, currentUser.id);
  }

  @Get()
  async getUserNotifications(@CurrentUser() currentUser: Auth.User): Promise<Selectable<DB.Notification>[] | undefined> {
    const notifications = await this.notificationsService.getAllUserNotification(currentUser.id);
    return notifications;
  }
}
