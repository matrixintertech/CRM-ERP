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
   * Aisa where condition jo kabhi
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
   * Existing projects ke liye
   * permission scopes ko Prisma
   * ProjectWhereInput me convert karta hai.
   *
   * Example:
   *
   * company.project.view + COMPANY
   * → {}
   *
   * company.project.view + PROJECT
   * → only projects jahan current
   *   employee ProjectMember hai.
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
     * Project is COMPANY-side resource.
     *
     * Company context ke bina koi
     * project access nahi milega.
     */
    if (!user.companyId) {
      return this.denyWhere();
    }

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
     * PermissionGuard normally
     * permission existence already
     * validate karega.
     *
     * Policy ko standalone use karne par
     * bhi safe rehna chahiye.
     */
    if (
      scopes.length ===
      0
    ) {
      return this.denyWhere();
    }

    /*
     * COMPANY is strongest project
     * scope.
     *
     * Repository already:
     *
     * companyId = current company
     *
     * enforce karta hai.
     *
     * Isliye additional filter ki
     * zarurat nahi.
     */
    if (
      scopes.includes(
        PermissionScope.COMPANY,
      )
    ) {
      return {};
    }

    const OR:
      Prisma.ProjectWhereInput[] =
      [];

    /*
     * PROJECT scope
     *
     * User employee hona chahiye aur
     * jis project ka ProjectMember hai
     * sirf wahi project accessible hoga.
     */
    if (
      scopes.includes(
        PermissionScope.PROJECT,
      ) &&
      user.employeeId
    ) {
    const memberships =
  await this.prisma
    .projectMember
    .findMany({
      where: {
        employeeId:
          user.employeeId,

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
        projectIds.length >
        0
      ) {
        OR.push({
          id: {
            in:
              projectIds,
          },
        });
      }
    }

    /*
     * OWN
     *
     * Project ke context me OWN ka
     * exact meaning pehle define karna
     * hoga:
     *
     * - createdBy?
     * - project manager?
     * - project lead?
     *
     * Isliye abhi automatic access nahi.
     */

    /*
     * ORGANIZATION_UNIT
     *
     * Employee ↔ OrganizationUnit
     * exact schema relation confirm karke
     * next add karenge.
     */

    /*
     * TEAM
     *
     * Team membership model ke according
     * baad me implement hoga.
     */

    /*
     * Agar available scopes me se koi
     * supported scope match nahi hua,
     * deny.
     */
    if (
      OR.length ===
      0
    ) {
      return this.denyWhere();
    }

    /*
     * Multiple scopes future me:
     *
     * PROJECT OR OU OR TEAM etc.
     */
    return {
      OR,
    };
  }
}