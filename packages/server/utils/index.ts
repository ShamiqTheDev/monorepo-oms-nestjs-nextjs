import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { SetMetadata } from "@nestjs/common";
import { DB } from "@atdb/types";
import { Selectable } from "kysely";

export const ANON_ACCESS_KEY = Symbol("ANON_ACCESS");

/**
 * @description Mark a route as public.
 */

export const AllowAnon = () => SetMetadata(ANON_ACCESS_KEY, true);

export const ROLES_KEY = Symbol("ROLES");

/**
 * @description Restrict route access to certain role(s).
 */
export const Roles = (...roles: DB.Role[]) => SetMetadata(ROLES_KEY, roles);

export const CurrentUser = createParamDecorator((data: string, ctx: ExecutionContext): Selectable<DB.User> => {
  return ctx.switchToHttp().getRequest().user;
});
