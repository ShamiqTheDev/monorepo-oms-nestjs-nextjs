import { ROLES_KEY } from "@atdb/server-utils";
import { DB } from "@atdb/types";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.getAllAndOverride<DB.Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!allowedRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return allowedRoles.includes(user.role);
  }
}
