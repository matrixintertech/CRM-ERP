import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import {
  Reflector,
} from "@nestjs/core";

import type {
  User,
} from "@prisma/client";

import {
  REQUIRED_PERMISSION_KEY,
} from "../decorators/require-permission.decorator";

import {
  EffectivePermissionService,
} from "../services/effective-permission.service";

@Injectable()
export class PermissionGuard
  implements CanActivate
{
  constructor(
    private readonly reflector:
      Reflector,

    private readonly effectivePermissionService:
      EffectivePermissionService,
  ) {}

  async canActivate(
    context:
      ExecutionContext,
  ): Promise<boolean> {
    const permissionCode =
      this.reflector.getAllAndOverride<
        string
      >(
        REQUIRED_PERMISSION_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    /*
     * Agar route par
     * @RequirePermission nahi hai,
     * guard authorization block
     * nahi karega.
     */
    if (!permissionCode) {
      return true;
    }

    const request =
      context
        .switchToHttp()
        .getRequest<{
          user?: User;
        }>();

    const user =
      request.user;

    if (!user) {
      throw new UnauthorizedException(
        "Authentication required.",
      );
    }

    const allowed =
      await this.effectivePermissionService
        .hasPermission(
          user.id,
          permissionCode,
        );

    if (!allowed) {
      throw new ForbiddenException(
        "You do not have permission to perform this action.",
      );
    }

    return true;
  }
}