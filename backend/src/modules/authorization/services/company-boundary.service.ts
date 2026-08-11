import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import {
  UserType,
} from "@prisma/client";

import {
  AuthorizationRepository,
} from "../repositories/authorization.repository";

@Injectable()
export class CompanyBoundaryService {
  constructor(
    private readonly authorizationRepository:
      AuthorizationRepository,
  ) {}

  /*
   * Current user's companyId return karo.
   *
   * Company-side services me useful hoga
   * jab Prisma queries ko tenant scoped
   * banana ho.
   *
   * Example:
   *
   * where: {
   *   companyId:
   *     await boundary.getCompanyId(user.id),
   * }
   */
  async getCompanyId(
    userId: bigint,
  ): Promise<bigint> {
    const user =
      await this.authorizationRepository
        .findUserContext(
          userId,
        );

    if (!user) {
      throw new UnauthorizedException(
        "Authentication required.",
      );
    }

    /*
     * Platform user tenant-owned
     * resources ke normal company flow
     * me enter nahi karega.
     */
    if (
      user.userType ===
      UserType.PLATFORM_OWNER
    ) {
      throw new ForbiddenException(
        "Platform users cannot access company resources through this authorization flow.",
      );
    }

    if (!user.companyId) {
      throw new ForbiddenException(
        "User is not associated with a company.",
      );
    }

    return user.companyId;
  }

  /*
   * Boolean boundary check.
   *
   * Resource company aur current user's
   * company same honi chahiye.
   */
  async belongsToCompany(
    userId: bigint,
    resourceCompanyId:
      bigint | null | undefined,
  ): Promise<boolean> {
    if (!resourceCompanyId) {
      return false;
    }

    const user =
      await this.authorizationRepository
        .findUserContext(
          userId,
        );

    if (!user) {
      return false;
    }

    if (
      user.userType ===
      UserType.PLATFORM_OWNER
    ) {
      return false;
    }

    if (!user.companyId) {
      return false;
    }

    return (
      user.companyId ===
      resourceCompanyId
    );
  }

  /*
   * Same company assert karo.
   *
   * Client / Vendor /
   * ProjectCategory jaise simple
   * tenant resources ke liye useful.
   */
  async assertSameCompany(
    userId: bigint,
    resourceCompanyId:
      bigint | null | undefined,
  ): Promise<void> {
    const allowed =
      await this.belongsToCompany(
        userId,
        resourceCompanyId,
      );

    if (!allowed) {
      throw new ForbiddenException(
        "You cannot access resources belonging to another company.",
      );
    }
  }
}