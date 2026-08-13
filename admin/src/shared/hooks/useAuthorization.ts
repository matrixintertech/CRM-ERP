import {
  useMemo,
} from "react";

import {
  useProfile,
} from "@/modules/profile/hooks/useProfile";

import type {
  PermissionScope,
} from "@/modules/profile/types/profile.types";


export const useAuthorization = () => {
  const {
    profile,
    loading,
    fetching,
  } = useProfile();


  /*
   * Permission code
   * →
   * effective scopes
   *
   * Example:
   *
   * company.department.view
   * →
   * Set([
   *   "ORGANIZATION_UNIT",
   *   "COMPANY",
   * ])
   *
   * Same permission ke multiple
   * scopes preserve rahenge.
   */
  const companyPermissionMap =
    useMemo(() => {
      const map =
        new Map<
          string,
          Set<PermissionScope>
        >();


      for (
        const permission
        of profile?.effectivePermissions ??
          []
      ) {
        if (
          permission.type !==
            "COMPANY" ||
          permission.scope ===
            null
        ) {
          continue;
        }


        const scopes =
          map.get(
            permission.code,
          ) ??
          new Set<PermissionScope>();


        scopes.add(
          permission.scope,
        );


        map.set(
          permission.code,
          scopes,
        );
      }


      return map;
    }, [
      profile?.effectivePermissions,
    ]);


  /*
   * Platform permissions are
   * scope-less.
   */
  const platformPermissionSet =
    useMemo(() => {
      const permissions =
        new Set<string>();


      for (
        const permission
        of profile?.effectivePermissions ??
          []
      ) {
        if (
          permission.type ===
          "PLATFORM"
        ) {
          permissions.add(
            permission.code,
          );
        }
      }


      return permissions;
    }, [
      profile?.effectivePermissions,
    ]);


  /*
   * Generic capability check.
   *
   * Company permission:
   * at least one effective scope
   * hona enough hai.
   *
   * Platform permission:
   * permission code existence.
   */
  const hasPermission = (
    permissionCode: string,
  ): boolean => {
    return (
      companyPermissionMap.has(
        permissionCode,
      ) ||
      platformPermissionSet.has(
        permissionCode,
      )
    );
  };


  /*
   * Check exact company scope.
   *
   * Example:
   *
   * hasScope(
   *   "company.department.update",
   *   "COMPANY",
   * )
   */
  const hasScope = (
    permissionCode: string,
    scope: PermissionScope,
  ): boolean => {
    return (
      companyPermissionMap
        .get(
          permissionCode,
        )
        ?.has(
          scope,
        ) ??
      false
    );
  };


  /*
   * Get all effective scopes for
   * one company permission.
   *
   * Example:
   *
   * [
   *   "ORGANIZATION_UNIT",
   *   "COMPANY",
   * ]
   */
  const getPermissionScopes = (
    permissionCode: string,
  ): PermissionScope[] => {
    return Array.from(
      companyPermissionMap.get(
        permissionCode,
      ) ??
        [],
    );
  };


  /*
   * Useful for sidebar groups/routes
   * where any one permission is enough.
   */
  const hasAnyPermission = (
    permissionCodes: string[],
  ): boolean => {
    return permissionCodes.some(
      (
        permissionCode,
      ) =>
        hasPermission(
          permissionCode,
        ),
    );
  };


  /*
   * Useful where every requested
   * capability is required.
   */
  const hasAllPermissions = (
    permissionCodes: string[],
  ): boolean => {
    return permissionCodes.every(
      (
        permissionCode,
      ) =>
        hasPermission(
          permissionCode,
        ),
    );
  };


  return {
    /*
     * Current session/profile.
     */
    profile,

    loading,
    fetching,


    /*
     * Authorization helpers.
     */
    hasPermission,

    hasScope,

    getPermissionScopes,

    hasAnyPermission,

    hasAllPermissions,
  };
};