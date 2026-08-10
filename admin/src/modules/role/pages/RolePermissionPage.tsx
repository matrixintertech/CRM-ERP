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
  CheckSquare,
  Square,
} from "lucide-react";

import {
  useDocumentTitle,
} from "@/shared/hooks/useDocumentTitle";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";

import RolePermissionGroup from "../components/RolePermissionGroup";

import {
  usePermission,
} from "../../permission/hooks/usePermission";

import {
  useRole,
} from "../hooks/useRoles";

import type {
  PermissionGroup,
} from "../../permission/types/permission.types";

import type {
  RolePermissionResponse,
} from "../types/role.types";

import type {
  PermissionScope,
  RolePermissionAssignment,
} from "../../role-permission/types/role-permission.types";

const RolePermissionPage = () => {
  const navigate =
    useNavigate();

  useDocumentTitle(
    "Role Permissions",
  );

  const {
    uuid,
  } = useParams<{
    uuid: string;
  }>();

  /*
   * Company roles should only see
   * COMPANY permissions.
   */
  const {
    loading:
      permissionLoading,

    groupedPermissions,
  } = usePermission({
    type: "COMPANY",
  });

  const {
    fetchRolePermissions,

    assignPermissions,

    savingPermissions,
  } = useRole();

  const [
    rolePermissionData,
    setRolePermissionData,
  ] = useState<
    RolePermissionResponse | null
  >(null);

  const [
    rolePermissionLoading,
    setRolePermissionLoading,
  ] = useState(false);

  /*
   * Selected permissions now store
   * both permission UUID and scope.
   */
  const [
    selectedPermissions,
    setSelectedPermissions,
  ] = useState<
    RolePermissionAssignment[]
  >([]);

  const [
    initialPermissions,
    setInitialPermissions,
  ] = useState<
    RolePermissionAssignment[]
  >([]);

  const [
    search,
    setSearch,
  ] = useState("");

useEffect(() => {
  if (!uuid) {
    return;
  }

  const loadRolePermissions =
    async () => {
      try {
        setRolePermissionLoading(
          true,
        );

        const response =
          await fetchRolePermissions(
            uuid,
          );

        setRolePermissionData(
          response,
        );

        const permissions:
          RolePermissionAssignment[] =
          response
            ?.permissions
            ?.map(
              (permission) => ({
                permissionUuid:
                  permission.uuid,

                scope:
                  permission.scope,
              }),
            ) ?? [];

        setSelectedPermissions(
          permissions.map(
            (permission) => ({
              ...permission,
            }),
          ),
        );

        setInitialPermissions(
          permissions.map(
            (permission) => ({
              ...permission,
            }),
          ),
        );
      } catch (error: any) {
        console.error(
          error?.response?.data ??
            error,
        );
      } finally {
        setRolePermissionLoading(
          false,
        );
      }
    };

  void loadRolePermissions();
}, [
  uuid,
]);

  /*
   * Derived UUID array is useful
   * for checkbox/group selection.
   */
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

  /*
   * Fast lookup for each
   * permission's current scope.
   */
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

  const filteredGroups =
    useMemo<
      PermissionGroup[]
    >(() => {
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
              PermissionGroup,
          ): PermissionGroup => ({
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
                    ) ||
                  permission.module
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
              PermissionGroup,
          ) =>
            group.permissions
              .length > 0,
        );
    }, [
      groupedPermissions,
      search,
    ]);

  const allPermissionUuids =
    useMemo(
      () =>
        groupedPermissions.flatMap(
          (
            group:
              PermissionGroup,
          ) =>
            group.permissions.map(
              (
                permission,
              ) =>
                permission.uuid,
            ),
        ),
      [
        groupedPermissions,
      ],
    );

  const visiblePermissionUuids =
    useMemo(
      () =>
        filteredGroups.flatMap(
          (
            group:
              PermissionGroup,
          ) =>
            group.permissions.map(
              (
                permission,
              ) =>
                permission.uuid,
            ),
        ),
      [
        filteredGroups,
      ],
    );

  const isAllVisibleSelected =
    visiblePermissionUuids.length >
      0 &&
    visiblePermissionUuids.every(
      (
        permissionUuid,
      ) =>
        selectedPermissionUuids.includes(
          permissionUuid,
        ),
    );

  /*
   * Compare permission + scope.
   * Scope change must also enable Save.
   */
  const hasChanges =
    useMemo(() => {
      if (
        initialPermissions.length !==
        selectedPermissions.length
      ) {
        return true;
      }

      return initialPermissions.some(
        (
          initialPermission,
        ) => {
          const currentPermission =
            selectedPermissions.find(
              (
                permission,
              ) =>
                permission
                  .permissionUuid ===
                initialPermission
                  .permissionUuid,
            );

          if (
            !currentPermission
          ) {
            return true;
          }

          return (
            currentPermission.scope !==
            initialPermission.scope
          );
        },
      );
    }, [
      initialPermissions,
      selectedPermissions,
    ]);

  const togglePermission = (
    permissionUuid: string,
  ) => {
    setSelectedPermissions(
      (
        previous,
      ) => {
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
      (
        previous,
      ) =>
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

  const toggleGroup = (
    group:
      PermissionGroup,
  ) => {
    const groupPermissionUuids =
      group.permissions.map(
        (
          permission,
        ) =>
          permission.uuid,
      );

    const allGroupSelected =
      groupPermissionUuids.length >
        0 &&
      groupPermissionUuids.every(
        (
          permissionUuid,
        ) =>
          selectedPermissionUuids.includes(
            permissionUuid,
          ),
      );

    setSelectedPermissions(
      (
        previous,
      ) => {
        if (
          allGroupSelected
        ) {
          return previous.filter(
            (
              permission,
            ) =>
              !groupPermissionUuids.includes(
                permission
                  .permissionUuid,
              ),
          );
        }

        const alreadySelected =
          new Set(
            previous.map(
              (
                permission,
              ) =>
                permission
                  .permissionUuid,
            ),
          );

        const newPermissions:
          RolePermissionAssignment[] =
          groupPermissionUuids
            .filter(
              (
                permissionUuid,
              ) =>
                !alreadySelected.has(
                  permissionUuid,
                ),
            )
            .map(
              (
                permissionUuid,
              ) => ({
                permissionUuid,

                scope:
                  "OWN",
              }),
            );

        return [
          ...previous,
          ...newPermissions,
        ];
      },
    );
  };

  const toggleAllVisible =
    () => {
      setSelectedPermissions(
        (
          previous,
        ) => {
          const selectedUuids =
            new Set(
              previous.map(
                (
                  permission,
                ) =>
                  permission
                    .permissionUuid,
              ),
            );

          const allVisibleSelected =
            visiblePermissionUuids.every(
              (
                permissionUuid,
              ) =>
                selectedUuids.has(
                  permissionUuid,
                ),
            );

          if (
            allVisibleSelected
          ) {
            return previous.filter(
              (
                permission,
              ) =>
                !visiblePermissionUuids.includes(
                  permission
                    .permissionUuid,
                ),
            );
          }

          const newPermissions:
            RolePermissionAssignment[] =
            visiblePermissionUuids
              .filter(
                (
                  permissionUuid,
                ) =>
                  !selectedUuids.has(
                    permissionUuid,
                  ),
              )
              .map(
                (
                  permissionUuid,
                ) => ({
                  permissionUuid,

                  scope:
                    "OWN",
                }),
              );

          return [
            ...previous,
            ...newPermissions,
          ];
        },
      );
    };

  const handleSave =
    async () => {
      if (!uuid) {
        return;
      }

      try {
        await assignPermissions(
          uuid,
          {
            permissions:
              selectedPermissions,
          },
        );

        setInitialPermissions(
          selectedPermissions.map(
            (
              permission,
            ) => ({
              ...permission,
            }),
          ),
        );
      } catch (
        error: any
      ) {
        console.error(
          error?.response
            ?.data ??
            error,
        );
      }
    };

  const handleReset =
    () => {
      setSelectedPermissions(
        initialPermissions.map(
          (
            permission,
          ) => ({
            ...permission,
          }),
        ),
      );
    };

  const loading =
    permissionLoading ||
    rolePermissionLoading;

  const actionLoading =
    savingPermissions;

  const role =
    rolePermissionData
      ?.role;

  if (!uuid) {
    return (
      <>
        <PageHeader
          title="Assign Permissions"
          subtitle="Invalid role"
          actions={
            <Button
              variant="secondary"
              onClick={() =>
                navigate(
                  "/settings/roles",
                )
              }
            >
              Back
            </Button>
          }
        />

        <Card>
          Role UUID is missing.
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Assign Permissions"
        subtitle={
          role
            ? `${role.name} (${role.code})`
            : "Manage role permissions"
        }
        actions={
          <div
            style={{
              display:
                "flex",
              gap: 12,
              flexWrap:
                "wrap",
            }}
          >
            <Button
              variant="secondary"
              onClick={() =>
                navigate(
                  "/settings/roles",
                )
              }
            >
              Back
            </Button>

            <Button
              variant="secondary"
              disabled={
                loading ||
                actionLoading ||
                !hasChanges
              }
              onClick={
                handleReset
              }
            >
              Reset
            </Button>

            <Button
              loading={
                actionLoading
              }
              disabled={
                loading ||
                actionLoading ||
                !hasChanges
              }
              onClick={
                handleSave
              }
            >
              Save Permissions
            </Button>
          </div>
        }
      />

      <Card>
        <div
          style={{
            display:
              "flex",
            flexDirection:
              "column",
            gap: 20,
          }}
        >
          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap: 16,
              flexWrap:
                "wrap",
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth:
                  240,
              }}
            >
              <Input
                label="Search Permissions"
                name="search"
                placeholder="Search by name, code or module"
                value={
                  search
                }
                onChange={(
                  event,
                ) =>
                  setSearch(
                    event.target
                      .value,
                  )
                }
              />
            </div>

            <Button
              variant="secondary"
              disabled={
                loading ||
                visiblePermissionUuids.length ===
                  0
              }
              onClick={
                toggleAllVisible
              }
            >
              {isAllVisibleSelected ? (
                <>
                  <CheckSquare
                    size={16}
                  />

                  Clear Visible
                </>
              ) : (
                <>
                  <Square
                    size={16}
                  />

                  Select Visible
                </>
              )}
            </Button>
          </div>

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap: 12,
              flexWrap:
                "wrap",
              fontSize:
                14,
            }}
          >
            <span>
              Selected permissions:{" "}
              <strong>
                {
                  selectedPermissions.length
                }
              </strong>
            </span>

            <span>
              Total permissions:{" "}
              <strong>
                {
                  allPermissionUuids.length
                }
              </strong>
            </span>
          </div>

          {loading &&
          groupedPermissions.length ===
            0 ? (
            <div>
              Loading permissions...
            </div>
          ) : filteredGroups.length ===
            0 ? (
            <div>
              No permissions found.
            </div>
          ) : (
            <div
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(360px, 1fr))",

                gap:
                  20,

                alignItems:
                  "start",
              }}
            >
              {filteredGroups.map(
                (
                  group:
                    PermissionGroup,
                ) => (
                  <RolePermissionGroup
                    key={
                      group.module
                    }
                    group={
                      group
                    }
                    selectedPermissionUuids={
                      selectedPermissionUuids
                    }
                    permissionScopes={
                      permissionScopes
                    }
                    disabled={
                      loading ||
                      actionLoading
                    }
                    onTogglePermission={
                      togglePermission
                    }
                    onScopeChange={
                      handleScopeChange
                    }
                    onToggleGroup={
                      toggleGroup
                    }
                  />
                ),
              )}
            </div>
          )}
        </div>
      </Card>

      {hasChanges && (
        <div
          style={{
            position:
              "sticky",
            bottom: 16,
            zIndex: 10,

            display:
              "flex",

            justifyContent:
              "flex-end",

            marginTop:
              16,

            pointerEvents:
              "none",
          }}
        >
          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap: 12,

              padding:
                "12px 16px",

              background:
                "var(--surface, #ffffff)",

              border:
                "1px solid var(--border-color, #e5e7eb)",

              borderRadius:
                10,

              boxShadow:
                "0 8px 30px rgba(0, 0, 0, 0.12)",

              pointerEvents:
                "auto",
            }}
          >
            <span>
              Unsaved permission changes
            </span>

            <Button
              variant="secondary"
              disabled={
                loading ||
                actionLoading
              }
              onClick={
                handleReset
              }
            >
              Reset
            </Button>

            <Button
              loading={
                actionLoading
              }
              disabled={
                loading ||
                actionLoading
              }
              onClick={
                handleSave
              }
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default RolePermissionPage;