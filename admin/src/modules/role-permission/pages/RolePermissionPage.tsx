import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useDocumentTitle,
} from "@/shared/hooks/useDocumentTitle";

import Card from "@/shared/components/Card";

import PermissionFooter from "../components/PermissionFooter";
import PermissionGroup from "../components/PermissionGroup";
import PermissionToolbar from "../components/PermissionToolbar";

import type {
  PermissionGroupData,
  PermissionScope,
  RolePermissionAssignment,
} from "../types/role-permission.types";

import {
  useRolePermissions,
} from "../hooks/useRolePermissions";

const RolePermissionPage = () => {
  const navigate =
    useNavigate();

  useDocumentTitle(
    "Role Permissions",
  );

  const {
    roleId,
  } = useParams<{
    roleId: string;
  }>();

  const [
    search,
    setSearch,
  ] = useState("");

  const {
    loading,
    saving,

    groupedPermissions,

    selectedPermissions:
      serverSelectedPermissions,

    savePermissions,
  } = useRolePermissions(
    roleId,
  );

  const [
    selectedPermissions,
    setSelectedPermissions,
  ] = useState<
    RolePermissionAssignment[]
  >([]);

  useEffect(() => {
    setSelectedPermissions(
      serverSelectedPermissions.map(
        (
          permission,
        ) => ({
          ...permission,
        }),
      ),
    );
  }, [
    serverSelectedPermissions,
  ]);

  const togglePermission = (
    permissionUuid: string,
  ) => {
    setSelectedPermissions(
      (previous) => {
        const exists =
          previous.some(
            (
              permission,
            ) =>
              permission
                .permissionUuid ===
              permissionUuid,
          );

        if (exists) {
          return previous.filter(
            (
              permission,
            ) =>
              permission
                .permissionUuid !==
              permissionUuid,
          );
        }

        return [
          ...previous,
          {
            permissionUuid,

            scope:
              "OWN",
          },
        ];
      },
    );
  };

  const handleScopeChange = (
    permissionUuid: string,
    scope: PermissionScope,
  ) => {
    setSelectedPermissions(
      (previous) =>
        previous.map(
          (
            permission,
          ) =>
            permission
              .permissionUuid ===
            permissionUuid
              ? {
                  ...permission,

                  scope,
                }
              : permission,
        ),
    );
  };

  const handleReset = () => {
    setSelectedPermissions(
      serverSelectedPermissions.map(
        (
          permission,
        ) => ({
          ...permission,
        }),
      ),
    );
  };

  const handleSave =
    async () => {
      if (!roleId) {
        return;
      }

      try {
        await savePermissions(
          selectedPermissions,
        );
      } catch (error) {
        console.error(
          "Failed to save role permissions:",
          error,
        );
      }
    };

  const selectedPermissionUuids =
    useMemo(
      () =>
        selectedPermissions.map(
          (
            permission,
          ) =>
            permission
              .permissionUuid,
        ),
      [
        selectedPermissions,
      ],
    );

  const permissionScopes =
    useMemo(
      () =>
        Object.fromEntries(
          selectedPermissions.map(
            (
              permission,
            ) => [
              permission
                .permissionUuid,

              permission.scope,
            ],
          ),
        ) as Record<
          string,
          PermissionScope
        >,
      [
        selectedPermissions,
      ],
    );

  const filteredGroups:
    PermissionGroupData[] =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      if (
        !normalizedSearch
      ) {
        return groupedPermissions;
      }

      return groupedPermissions
        .map(
          (
            group:
              PermissionGroupData,
          ) => ({
            ...group,

            permissions:
              group.permissions.filter(
                (
                  permission,
                ) =>
                  permission.name
                    .toLowerCase()
                    .includes(
                      normalizedSearch,
                    ) ||
                  permission.code
                    .toLowerCase()
                    .includes(
                      normalizedSearch,
                    ),
              ),
          }),
        )
        .filter(
          (
            group:
              PermissionGroupData,
          ) =>
            group.permissions
              .length > 0,
        );
    }, [
      groupedPermissions,
      search,
    ]);

  return (
    <>
      <PermissionToolbar
        roleName="Role Permissions"
        search={
          search
        }
        onSearchChange={
          setSearch
        }
        onBack={() =>
          navigate(
            -1,
          )
        }
      />

      <Card>
        {loading ? (
          <p>
            Loading permissions...
          </p>
        ) : filteredGroups.length ===
          0 ? (
          <p>
            No permissions found.
          </p>
        ) : (
          filteredGroups.map(
            (group) => (
              <PermissionGroup
                key={
                  group.module
                }
                module={
                  group.module
                }
                permissions={
                  group.permissions
                }
                selectedPermissions={
                  selectedPermissionUuids
                }
                permissionScopes={
                  permissionScopes
                }
                onToggle={
                  togglePermission
                }
                onScopeChange={
                  handleScopeChange
                }
              />
            ),
          )
        )}

        <PermissionFooter
          loading={
            saving
          }
          selectedCount={
            selectedPermissions.length
          }
          onReset={
            handleReset
          }
          onSave={
            handleSave
          }
        />
      </Card>
    </>
  );
};

export default RolePermissionPage;