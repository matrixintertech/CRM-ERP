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

  const {
    loading:
      permissionLoading,

    groupedPermissions,
  } = usePermission();

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

  const [
    selectedPermissionUuids,
    setSelectedPermissionUuids,
  ] = useState<
    string[]
  >([]);

  const [
    initialPermissionUuids,
    setInitialPermissionUuids,
  ] = useState<
    string[]
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

          const permissionUuids =
            response
              ?.permissionUuids ??
            [];

          setSelectedPermissionUuids(
            [
              ...permissionUuids,
            ],
          );

          setInitialPermissionUuids(
            [
              ...permissionUuids,
            ],
          );
        } catch (error: any) {
          console.error(
            error?.response
              ?.data ??
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

  const hasChanges =
    useMemo(() => {
      if (
        initialPermissionUuids.length !==
        selectedPermissionUuids.length
      ) {
        return true;
      }

      return !initialPermissionUuids.every(
        (
          permissionUuid,
        ) =>
          selectedPermissionUuids.includes(
            permissionUuid,
          ),
      );
    }, [
      initialPermissionUuids,
      selectedPermissionUuids,
    ]);

  const togglePermission = (
    permissionUuid: string,
  ) => {
    setSelectedPermissionUuids(
      (
        previous,
      ) =>
        previous.includes(
          permissionUuid,
        )
          ? previous.filter(
              (
                item,
              ) =>
                item !==
                permissionUuid,
            )
          : [
              ...previous,
              permissionUuid,
            ],
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

    setSelectedPermissionUuids(
      (
        previous,
      ) => {
        if (
          allGroupSelected
        ) {
          return previous.filter(
            (
              permissionUuid,
            ) =>
              !groupPermissionUuids.includes(
                permissionUuid,
              ),
          );
        }

        return Array.from(
          new Set([
            ...previous,
            ...groupPermissionUuids,
          ]),
        );
      },
    );
  };

  const toggleAllVisible =
    () => {
      setSelectedPermissionUuids(
        (
          previous,
        ) => {
          const allVisibleSelected =
            visiblePermissionUuids.every(
              (
                permissionUuid,
              ) =>
                previous.includes(
                  permissionUuid,
                ),
            );

          if (
            allVisibleSelected
          ) {
            return previous.filter(
              (
                permissionUuid,
              ) =>
                !visiblePermissionUuids.includes(
                  permissionUuid,
                ),
            );
          }

          return Array.from(
            new Set([
              ...previous,
              ...visiblePermissionUuids,
            ]),
          );
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
            permissionUuids:
              selectedPermissionUuids,
          },
        );

        setInitialPermissionUuids(
          [
            ...selectedPermissionUuids,
          ],
        );
      } catch (error: any) {
        console.error(
          error?.response?.data ??
            error,
        );
      }
    };

  const handleReset =
    () => {
      setSelectedPermissionUuids(
        [
          ...initialPermissionUuids,
        ],
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
                  selectedPermissionUuids.length
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
                  "repeat(auto-fit, minmax(320px, 1fr))",

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
                    disabled={
                      loading ||
                      actionLoading
                    }
                    onTogglePermission={
                      togglePermission
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