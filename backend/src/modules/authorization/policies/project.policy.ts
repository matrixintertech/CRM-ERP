import {
  Injectable,
} from '@nestjs/common';

import {
  PermissionScope,
  Prisma,
} from '@prisma/client';

import {
  PrismaService,
} from 'src/database/prisma.service';

import {
  EffectivePermissionService,
} from '../services/effective-permission.service';

@Injectable()
export class ProjectPolicy {
  constructor(
    private readonly prisma:
      PrismaService,

    private readonly effectivePermissionService:
      EffectivePermissionService,
  ) {}

  /*
   * Aisa filter jo kabhi
   * kisi project ko match na kare.
   */
  private denyWhere():
    Prisma.ProjectWhereInput {
    return {
      id: {
        in: [],
      },
    };
  }

  /*
   * Project resource ke supported scopes:
   *
   * COMPANY
   * → current company ke saare projects
   *
   * PROJECT
   * → sirf wahi projects jahan current
   *   employee active ProjectMember hai
   *
   * OWN / TEAM / ORGANIZATION_UNIT
   * → Project resource ke liye currently
   *   applicable nahi hain.
   */
  async buildWhere(
    userId: bigint,
    permissionCode: string,
  ): Promise<Prisma.ProjectWhereInput> {
    const authorization =
      await this.effectivePermissionService
        .getAuthorization(
          userId,
        );

    const {
      user,
      companyPermissions,
    } = authorization;

    /*
     * Project company-side resource hai.
     */
    if (!user.companyId) {
      return this.denyWhere();
    }

    /*
     * Same permission multiple sources /
     * scopes se aa sakti hai.
     *
     * Example:
     * ROLE → PROJECT
     * USER → COMPANY
     */
    const scopes =
      Array.from(
        new Set(
          companyPermissions
            .filter(
              (permission) =>
                permission.code ===
                permissionCode,
            )
            .map(
              (permission) =>
                permission.scope,
            ),
        ),
      );

    /*
     * Permission nahi mili to deny.
     *
     * PermissionGuard normally isko
     * pehle hi block karega, but policy
     * standalone bhi safe rehni chahiye.
     */
    if (
      scopes.length ===
      0
    ) {
      return this.denyWhere();
    }

    /*
     * COMPANY scope:
     *
     * Repository already current
     * companyId enforce karta hai.
     *
     * Isliye additional filter nahi.
     */
    if (
      scopes.includes(
        PermissionScope.COMPANY,
      )
    ) {
      return {};
    }

    /*
     * PROJECT scope:
     *
     * Company user employee bhi hona
     * chahiye, kyunki ProjectMember
     * Employee se linked hai.
     */
    if (
      scopes.includes(
        PermissionScope.PROJECT,
      )
    ) {
      if (!user.employeeId) {
        return this.denyWhere();
      }

      const memberships =
        await this.prisma
          .projectMember
          .findMany({
            where: {
              companyId:
                user.companyId,

              employeeId:
                user.employeeId,

              isActive:
                true,

              removedAt:
                null,

              project: {
                companyId:
                  user.companyId,

                deletedAt:
                  null,
              },
            },

            select: {
              projectId:
                true,
            },
          });

      const projectIds =
        Array.from(
          new Set(
            memberships.map(
              (membership) =>
                membership.projectId,
            ),
          ),
        );

      if (
        projectIds.length ===
        0
      ) {
        return this.denyWhere();
      }

      return {
        id: {
          in:
            projectIds,
        },
      };
    }

    /*
     * Project resource par currently:
     *
     * OWN
     * TEAM
     * ORGANIZATION_UNIT
     *
     * supported nahi hain.
     *
     * Agar permission galti se in scopes
     * ke saath assign ho gayi to broad
     * access dene ke bajay deny karo.
     */
    return this.denyWhere();
  }
}