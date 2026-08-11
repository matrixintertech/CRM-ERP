import {
  ForbiddenException,
  Injectable,
} from "@nestjs/common";

import {
  PermissionScope,
  UserType,
} from "@prisma/client";

import {
  EffectivePermissionService,
} from "./effective-permission.service";

export interface PermissionScopeContext {
  /*
   * Resource kis company ka hai.
   *
   * Tenant boundary sabse pehle
   * validate hogi.
   */
  resourceCompanyId:
    bigint;

  /*
   * Resource-specific policy
   * ye flags calculate karegi.
   */

  isOwner?:
    boolean;

  isTeamMember?:
    boolean;

  isOrganizationUnitMember?:
    boolean;

  isProjectMember?:
    boolean;
}

@Injectable()
export class PermissionScopeService {
  constructor(
    private readonly effectivePermissionService:
      EffectivePermissionService,
  ) {}

  /*
   * Current company permission ke
   * saare effective scopes return karo.
   *
   * Example:
   *
   * company.task.view
   *
   * ROLE:
   * OWN
   *
   * USER:
   * PROJECT
   *
   * Result:
   * [OWN, PROJECT]
   */
  async getScopes(
    userId: bigint,
    permissionCode: string,
  ): Promise<
    PermissionScope[]
  > {
    return this.effectivePermissionService
      .getCompanyPermissionScopes(
        userId,
        permissionCode,
      );
  }

  /*
   * User ke paas particular scope
   * available hai ya nahi.
   */
  async hasScope(
    userId: bigint,
    permissionCode: string,
    scope: PermissionScope,
  ): Promise<boolean> {
    const scopes =
      await this.getScopes(
        userId,
        permissionCode,
      );

    return scopes.includes(
      scope,
    );
  }

  /*
   * Multiple scopes me se koi ek
   * available hai ya nahi.
   */
  async hasAnyScope(
    userId: bigint,
    permissionCode: string,
    requiredScopes:
      PermissionScope[],
  ): Promise<boolean> {
    const scopes =
      await this.getScopes(
        userId,
        permissionCode,
      );

    return requiredScopes.some(
      (scope) =>
        scopes.includes(
          scope,
        ),
    );
  }

  /*
   * COMPANY scope convenience check.
   */
  async hasCompanyScope(
    userId: bigint,
    permissionCode: string,
  ): Promise<boolean> {
    return this.hasScope(
      userId,
      permissionCode,
      PermissionScope.COMPANY,
    );
  }

  /*
   * Main scope evaluator.
   *
   * IMPORTANT:
   *
   * Ye resource ownership/membership
   * calculate nahi karta.
   *
   * TaskPolicy / ProjectPolicy /
   * InvoicePolicy etc. context flags
   * calculate karke yahan pass karenge.
   */
  async canAccess(
    userId: bigint,
    permissionCode: string,
    context:
      PermissionScopeContext,
  ): Promise<boolean> {
    const authorization =
      await this.effectivePermissionService
        .getAuthorization(
          userId,
        );

    const user =
      authorization.user;

    /*
     * PermissionScope sirf COMPANY
     * authorization flow ke liye hai.
     *
     * Platform owner company scoped
     * authorization use nahi karega.
     */
    if (
      user.userType ===
      UserType.PLATFORM_OWNER
    ) {
      return false;
    }

    /*
     * Hard tenant boundary.
     *
     * Kisi bhi scope se user doosri
     * company ka resource access
     * nahi kar sakta.
     */
    if (
      !user.companyId ||
      user.companyId !==
        context.resourceCompanyId
    ) {
      return false;
    }

    const scopes =
      authorization
        .companyPermissions
        .filter(
          (permission) =>
            permission.code ===
            permissionCode,
        )
        .map(
          (permission) =>
            permission.scope,
        );

    if (
      scopes.length ===
      0
    ) {
      return false;
    }

    /*
     * COMPANY:
     *
     * Current tenant ke andar
     * unrestricted resource access.
     */
    if (
      scopes.includes(
        PermissionScope.COMPANY,
      )
    ) {
      return true;
    }

    /*
     * OWN:
     *
     * Resource policy define karegi
     * "own" ka actual meaning.
     *
     * Task:
     * assigned employee
     *
     * Vendor PO:
     * assigned vendor
     *
     * Client approval:
     * assigned client
     */
    if (
      scopes.includes(
        PermissionScope.OWN,
      ) &&
      context.isOwner ===
        true
    ) {
      return true;
    }

    /*
     * TEAM
     */
    if (
      scopes.includes(
        PermissionScope.TEAM,
      ) &&
      context.isTeamMember ===
        true
    ) {
      return true;
    }

    /*
     * ORGANIZATION_UNIT
     */
    if (
      scopes.includes(
        PermissionScope.ORGANIZATION_UNIT,
      ) &&
      context.isOrganizationUnitMember ===
        true
    ) {
      return true;
    }

    /*
     * PROJECT
     */
    if (
      scopes.includes(
        PermissionScope.PROJECT,
      ) &&
      context.isProjectMember ===
        true
    ) {
      return true;
    }

    return false;
  }

  /*
   * Same as canAccess(), but controllers /
   * services ke liye convenient assertion.
   *
   * false hone par directly 403.
   */
  async assertAccess(
    userId: bigint,
    permissionCode: string,
    context:
      PermissionScopeContext,
  ): Promise<void> {
    const allowed =
      await this.canAccess(
        userId,
        permissionCode,
        context,
      );

    if (!allowed) {
      throw new ForbiddenException(
        "You do not have permission to access this resource.",
      );
    }
  }
}