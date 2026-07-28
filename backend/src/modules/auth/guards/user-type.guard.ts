import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { UserType } from '@prisma/client';

import { USER_TYPES_KEY } from '../decorators/user-types.decorator';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredUserTypes =
      this.reflector.getAllAndOverride<UserType[]>(
        USER_TYPES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    // Agar decorator nahi laga hai to allow
    if (!requiredUserTypes) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException(
        'User not authenticated.',
      );
    }

    if (
      !requiredUserTypes.includes(
        user.userType,
      )
    ) {
      throw new ForbiddenException(
        'You do not have permission to access this resource.',
      );
    }

    return true;
  }
}