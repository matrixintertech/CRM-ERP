import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import type {
  Permission,
  PermissionScope,
  UserPermissionAssignment,
  UserPermissions,
} from "../types/user.types";

interface Props {
  open: boolean;

  loading: boolean;

  permissions:
    | UserPermissions
    | null;

  allPermissions:
    Permission[];

  onClose: () => void;

  onSubmit: (
    permissions:
      UserPermissionAssignment[],
  ) => Promise<void>;
}

interface PermissionGroup {
  module: string;
  permissions: Permission[];
}

const scopeLabels: Record<
  PermissionScope,
  string
> = {
  OWN: "Own",
  TEAM: "Team",
  ORGANIZATION_UNIT:
    "Organization Unit",
  PROJECT: "Project",
  COMPANY: "Company",
};

const formatModuleName = (
  value: string,
) =>
  value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");

const formatScope = (
  scope: PermissionScope,
) =>
  scopeLabels[scope] ?? scope;

const createGrantKey = (
  permissionUuid: string,
  scope: PermissionScope,
) =>
  `${permissionUuid}:${scope}`;

const UserPermissionsModal = ({
  open,
  loading,
  permissions,
  allPermissions,
  onClose,
  onSubmit,
}: Props) => {
  const [
    selectedPermissions,
    setSelectedPermissions,
  ] = useState<
    UserPermissionAssignment[]
  >([]);

  const [
    search,
    setSearch,
  ] = useState("");

  /*
   * Load existing DIRECT user grants.
   *
   * Same permission can exist with
   * multiple scopes.
   */
  useEffect(() => {
    if (
      !open ||
      !permissions
    ) {
      return;
    }

    setSelectedPermissions(
      permissions.additionalPermissions.map(
        (permission) => ({
          permissionUuid:
            permission.uuid,

          scope:
            permission.scope,
        }),
      ),
    );

    setSearch("");
  }, [
    open,
    permissions,
  ]);

  /*
   * Role scopes grouped by permission.
   *
   * Example:
   *
   * employee.view
   * - ORGANIZATION_UNIT
   * - PROJECT
   */
  const roleScopeMap =
    useMemo(() => {
      const map =
        new Map<
          string,
          Set<PermissionScope>
        >();

      for (
        const permission
        of permissions
          ?.rolePermissions ??
        []
      ) {
        const scopes =
          map.get(
            permission.uuid,
          ) ??
          new Set<PermissionScope>();

        scopes.add(
          permission.scope,
        );

        map.set(
          permission.uuid,
          scopes,
        );
      }

      return map;
    }, [
      permissions,
    ]);

  /*
   * Direct user grants grouped
   * by permission.
   */
  const directScopeMap =
    useMemo(() => {
      const map =
        new Map<
          string,
          Set<PermissionScope>
        >();

      for (
        const permission
        of selectedPermissions
      ) {
        const scopes =
          map.get(
            permission.permissionUuid,
          ) ??
          new Set<PermissionScope>();

        scopes.add(
          permission.scope,
        );

        map.set(
          permission.permissionUuid,
          scopes,
        );
      }

      return map;
    }, [
      selectedPermissions,
    ]);

  /*
   * Exact grant lookup:
   *
   * permissionUuid + scope
   */
  const selectedGrantKeys =
    useMemo(
      () =>
        new Set(
          selectedPermissions.map(
            (permission) =>
              createGrantKey(
                permission.permissionUuid,
                permission.scope,
              ),
          ),
        ),
      [
        selectedPermissions,
      ],
    );

  /*
   * Only COMPANY permissions.
   */
  const groupedPermissions =
    useMemo<
      PermissionGroup[]
    >(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      const filteredPermissions =
        allPermissions.filter(
          (permission) => {
            if (
              permission.type !==
              "COMPANY"
            ) {
              return false;
            }

            if (
              !normalizedSearch
            ) {
              return true;
            }

            return (
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
                )
            );
          },
        );

      const groups =
        new Map<
          string,
          Permission[]
        >();

      for (
        const permission
        of filteredPermissions
      ) {
        const existing =
          groups.get(
            permission.module,
          ) ?? [];

        existing.push(
          permission,
        );

        groups.set(
          permission.module,
          existing,
        );
      }

      return Array.from(
        groups.entries(),
      )
        .map(
          ([
            module,
            modulePermissions,
          ]) => ({
            module,

            permissions:
              modulePermissions.sort(
                (
                  first,
                  second,
                ) =>
                  first.name.localeCompare(
                    second.name,
                  ),
              ),
          }),
        )
        .sort(
          (
            first,
            second,
          ) =>
            first.module.localeCompare(
              second.module,
            ),
        );
    }, [
      allPermissions,
      search,
    ]);

  /*
   * Toggle one exact direct grant.
   *
   * Example:
   *
   * company.user.view
   * +
   * ORGANIZATION_UNIT
   */
  const handleScopeToggle = (
    permissionUuid: string,
    scope: PermissionScope,
  ) => {
    const key =
      createGrantKey(
        permissionUuid,
        scope,
      );

    setSelectedPermissions(
      (previous) => {
        const exists =
          previous.some(
            (permission) =>
              createGrantKey(
                permission.permissionUuid,
                permission.scope,
              ) === key,
          );

        if (exists) {
          return previous.filter(
            (permission) =>
              createGrantKey(
                permission.permissionUuid,
                permission.scope,
              ) !== key,
          );
        }

        return [
          ...previous,
          {
            permissionUuid,
            scope,
          },
        ];
      },
    );
  };

  /*
   * Remove all direct grants
   * for one permission.
   */
  const clearPermissionGrants = (
    permissionUuid: string,
  ) => {
    setSelectedPermissions(
      (previous) =>
        previous.filter(
          (permission) =>
            permission.permissionUuid !==
            permissionUuid,
        ),
    );
  };

  /*
   * Remove all direct grants
   * from one module.
   */
  const clearModuleGrants = (
    group: PermissionGroup,
  ) => {
    const permissionUuids =
      new Set(
        group.permissions.map(
          (permission) =>
            permission.uuid,
        ),
      );

    setSelectedPermissions(
      (previous) =>
        previous.filter(
          (permission) =>
            !permissionUuids.has(
              permission.permissionUuid,
            ),
        ),
    );
  };

  const handleSave =
    async () => {
      await onSubmit(
        selectedPermissions,
      );
    };

  const displayName =
    permissions?.user
      .displayName ??
    permissions?.user
      .employee
      ?.displayName ??
    "User";

  /*
   * Effective grant count is
   * permission + scope based.
   */
  const effectivePermissionCount =
    useMemo(() => {
      const grants =
        new Set<string>();

      for (
        const permission
        of permissions
          ?.rolePermissions ??
        []
      ) {
        grants.add(
          createGrantKey(
            permission.uuid,
            permission.scope,
          ),
        );
      }

      for (
        const permission
        of selectedPermissions
      ) {
        grants.add(
          createGrantKey(
            permission.permissionUuid,
            permission.scope,
          ),
        );
      }

      return grants.size;
    }, [
      permissions,
      selectedPermissions,
    ]);

  return (
    <Modal
      open={open}
      title="Additional Permissions"
      onClose={onClose}
      size="lg"
    >
      {loading &&
      !permissions ? (
        <p>
          Loading permissions...
        </p>
      ) : !permissions ? (
        <p>
          Permission information
          not found.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 22,
          }}
        >
          {/* User Header */}

          <section
            style={{
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "space-between",
              flexWrap: "wrap",
              gap: 16,

              paddingBottom: 18,

              borderBottom:
                "1px solid #e5e7eb",
            }}
          >
            <div>
              <h3
                style={{
                  margin:
                    "0 0 6px",

                  color:
                    "#111827",
                }}
              >
                {displayName}
              </h3>

              <div
                style={{
                  color:
                    "#6b7280",

                  fontSize: 14,

                  overflowWrap:
                    "anywhere",
                }}
              >
                {permissions.user
                  .email ?? "-"}
              </div>
            </div>

            <div
              style={{
                padding:
                  "8px 12px",

                border:
                  "1px solid #dbeafe",

                borderRadius:
                  999,

                background:
                  "#eff6ff",

                color:
                  "#1d4ed8",

                fontSize: 13,

                fontWeight:
                  600,
              }}
            >
              Role:{" "}
              {permissions.role
                ?.name ??
                "No role assigned"}
            </div>
          </section>

          {/* Summary */}

          <section
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",

              gap: 12,
            }}
          >
            <SummaryCard
              label="Role Grants"
              value={
                permissions
                  .rolePermissions
                  .length
              }
            />

            <SummaryCard
              label="Additional Grants"
              value={
                selectedPermissions.length
              }
            />

            <SummaryCard
              label="Effective Grants"
              value={
                effectivePermissionCount
              }
            />
          </section>

          {/* Search */}

          <input
            type="search"
            placeholder="Search by permission name, code or module..."
            value={search}
            onChange={(
              event,
            ) =>
              setSearch(
                event.target.value,
              )
            }
            style={{
              width: "100%",

              boxSizing:
                "border-box",

              padding:
                "12px 14px",

              border:
                "1px solid #d1d5db",

              borderRadius:
                9,

              color:
                "#111827",

              fontSize: 14,

              outline: "none",
            }}
          />

          {/* Permission Modules */}

          <div
            style={{
              display: "grid",
              gap: 16,

              maxHeight:
                "55vh",

              overflowY:
                "auto",

              overflowX:
                "hidden",

              paddingRight: 8,

              paddingBottom: 4,
            }}
          >
            {groupedPermissions.length ===
            0 ? (
              <div
                style={{
                  padding: 32,

                  border:
                    "1px dashed #d1d5db",

                  borderRadius:
                    10,

                  color:
                    "#6b7280",

                  textAlign:
                    "center",
                }}
              >
                No permissions found.
              </div>
            ) : (
              groupedPermissions.map(
                (group) => {
                  const moduleDirectCount =
                    selectedPermissions.filter(
                      (
                        permission,
                      ) =>
                        group.permissions.some(
                          (
                            item,
                          ) =>
                            item.uuid ===
                            permission.permissionUuid,
                        ),
                    ).length;

                  return (
                    <section
                      key={
                        group.module
                      }
                      style={{
                        border:
                          "1px solid #e5e7eb",

                        borderRadius:
                          12,

                        background:
                          "#ffffff",
                      }}
                    >
                      {/* Module Header */}

                      <div
                        style={{
                          display:
                            "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "space-between",

                          flexWrap:
                            "wrap",

                          gap: 12,

                          padding:
                            "14px 16px",

                          background:
                            "#f8fafc",

                          borderBottom:
                            "1px solid #e5e7eb",
                        }}
                      >
                        <div>
                          <strong>
                            {formatModuleName(
                              group.module,
                            )}
                          </strong>

                          <span
                            style={{
                              display:
                                "block",

                              marginTop: 3,

                              color:
                                "#6b7280",

                              fontSize:
                                12,
                            }}
                          >
                            {
                              group
                                .permissions
                                .length
                            }{" "}
                            permission
                            {group
                              .permissions
                              .length !==
                            1
                              ? "s"
                              : ""}
                            {" • "}
                            {
                              moduleDirectCount
                            }{" "}
                            direct grant
                            {moduleDirectCount !==
                            1
                              ? "s"
                              : ""}
                          </span>
                        </div>

                        {moduleDirectCount >
                          0 && (
                          <button
                            type="button"
                            disabled={
                              loading
                            }
                            onClick={() =>
                              clearModuleGrants(
                                group,
                              )
                            }
                            style={{
                              border:
                                "none",

                              background:
                                "transparent",

                              color:
                                "#dc2626",

                              cursor:
                                loading
                                  ? "not-allowed"
                                  : "pointer",

                              fontSize:
                                12,

                              fontWeight:
                                600,
                            }}
                          >
                            Clear direct
                            grants
                          </button>
                        )}
                      </div>

                      {/* Permission Rows */}

                      <div
                        style={{
                          display:
                            "grid",

                          gap: 10,

                          padding: 14,
                        }}
                      >
                        {group.permissions.map(
                          (
                            permission,
                          ) => {
                            const roleScopes =
                              roleScopeMap.get(
                                permission.uuid,
                              ) ??
                              new Set<PermissionScope>();

                            const directScopes =
                              directScopeMap.get(
                                permission.uuid,
                              ) ??
                              new Set<PermissionScope>();

                            const additionalAllowedScopes =
                              (
                                permission.allowedScopes ??
                                []
                              ).filter(
                                (scope) =>
                                  !roleScopes.has(
                                    scope,
                                  ),
                              );

                            return (
                              <div
                                key={
                                  permission.uuid
                                }
                                style={{
                                  width:
                                    "100%",

                                  boxSizing:
                                    "border-box",

                                  padding:
                                    "14px",

                                  border:
                                    directScopes.size >
                                    0
                                      ? "1px solid #86efac"
                                      : roleScopes.size >
                                          0
                                        ? "1px solid #bfdbfe"
                                        : "1px solid #e5e7eb",

                                  borderRadius:
                                    10,

                                  background:
                                    directScopes.size >
                                    0
                                      ? "#f0fdf4"
                                      : roleScopes.size >
                                          0
                                        ? "#eff6ff"
                                        : "#ffffff",
                                }}
                              >
                                <div
                                  style={{
                                    display:
                                      "flex",

                                    justifyContent:
                                      "space-between",

                                    gap: 12,

                                    alignItems:
                                      "flex-start",

                                    flexWrap:
                                      "wrap",
                                  }}
                                >
                                  <div
                                    style={{
                                      minWidth:
                                        0,

                                      flex: 1,
                                    }}
                                  >
                                    <div
                                      style={{
                                        color:
                                          "#111827",

                                        fontSize:
                                          14,

                                        fontWeight:
                                          600,

                                        overflowWrap:
                                          "anywhere",
                                      }}
                                    >
                                      {
                                        permission.name
                                      }
                                    </div>

                                    <div
                                      style={{
                                        marginTop:
                                          4,

                                        color:
                                          "#6b7280",

                                        fontSize:
                                          12,

                                        overflowWrap:
                                          "anywhere",
                                      }}
                                    >
                                      {
                                        permission.code
                                      }
                                    </div>

                                    {permission.description && (
                                      <div
                                        style={{
                                          marginTop:
                                            4,

                                          color:
                                            "#9ca3af",

                                          fontSize:
                                            12,
                                        }}
                                      >
                                        {
                                          permission.description
                                        }
                                      </div>
                                    )}
                                  </div>

                                  {directScopes.size >
                                    0 && (
                                    <button
                                      type="button"
                                      disabled={
                                        loading
                                      }
                                      onClick={() =>
                                        clearPermissionGrants(
                                          permission.uuid,
                                        )
                                      }
                                      style={{
                                        border:
                                          "none",

                                        background:
                                          "transparent",

                                        color:
                                          "#dc2626",

                                        cursor:
                                          loading
                                            ? "not-allowed"
                                            : "pointer",

                                        fontSize:
                                          12,

                                        fontWeight:
                                          600,
                                      }}
                                    >
                                      Clear
                                    </button>
                                  )}
                                </div>

                                {/* Role grants */}

                                {roleScopes.size >
                                  0 && (
                                  <div
                                    style={{
                                      marginTop:
                                        12,
                                    }}
                                  >
                                    <div
                                      style={{
                                        marginBottom:
                                          6,

                                        color:
                                          "#6b7280",

                                        fontSize:
                                          11,

                                        fontWeight:
                                          600,

                                        textTransform:
                                          "uppercase",
                                      }}
                                    >
                                      Role
                                      grants
                                    </div>

                                    <div
                                      style={{
                                        display:
                                          "flex",

                                        flexWrap:
                                          "wrap",

                                        gap: 6,
                                      }}
                                    >
                                      {Array.from(
                                        roleScopes,
                                      ).map(
                                        (
                                          scope,
                                        ) => (
                                          <span
                                            key={
                                              scope
                                            }
                                            style={{
                                              padding:
                                                "4px 8px",

                                              borderRadius:
                                                999,

                                              background:
                                                "#dbeafe",

                                              color:
                                                "#1d4ed8",

                                              fontSize:
                                                11,

                                              fontWeight:
                                                600,
                                            }}
                                          >
                                            {formatScope(
                                              scope,
                                            )}
                                          </span>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Direct grants */}

                                <div
                                  style={{
                                    marginTop:
                                      14,
                                  }}
                                >
                                  <div
                                    style={{
                                      marginBottom:
                                        8,

                                      color:
                                        "#6b7280",

                                      fontSize:
                                        11,

                                      fontWeight:
                                        600,

                                      textTransform:
                                        "uppercase",
                                    }}
                                  >
                                    Additional
                                    scopes
                                  </div>

                                  {additionalAllowedScopes.length ===
                                    0 ? (
                                    <div
                                      style={{
                                        padding:
                                          "10px 12px",

                                        border:
                                          "1px dashed #d1d5db",

                                        borderRadius:
                                          8,

                                        color:
                                          "#9ca3af",

                                        fontSize:
                                          12,
                                      }}
                                    >
                                      All available scopes are
                                      already inherited from
                                      the role.
                                    </div>
                                  ) : (
                                    <div
                                      style={{
                                        display:
                                          "flex",

                                        flexWrap:
                                          "wrap",

                                        gap: 8,
                                      }}
                                    >
                                      {additionalAllowedScopes.map(
                                        (
                                          scope,
                                        ) => {
                                          const selected =
                                            selectedGrantKeys.has(
                                              createGrantKey(
                                                permission.uuid,
                                                scope,
                                              ),
                                            );

                                         

                                          return (
                                            <label
                                              key={
                                                scope
                                              }
                                              style={{
                                                display:
                                                  "flex",

                                                alignItems:
                                                  "center",

                                                gap: 7,

                                                padding:
                                                  "8px 10px",

                                                border:
                                                  selected
                                                    ? "1px solid #86efac"
                                                    : "1px solid #d1d5db",

                                                borderRadius:
                                                  8,

                                                background:
                                                  selected
                                                    ? "#dcfce7"
                                                    : "#ffffff",

                                                color:
                                                  "#374151",

                                                cursor:
                                                  loading
                                                    ? "not-allowed"
                                                    : "pointer",

                                                fontSize:
                                                  12,
                                              }}
                                            >
                                              <input
                                                type="checkbox"
                                                checked={
                                                  selected
                                                }
                                                disabled={
                                                  loading
                                                }
                                                onChange={() =>
                                                  handleScopeToggle(
                                                    permission.uuid,
                                                    scope,
                                                  )
                                                }
                                              />

                                              <span>
                                                {formatScope(
                                                  scope,
                                                )}
                                              </span>

                                              
                                            </label>
                                          );
                                        },
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </section>
                  );
                },
              )
            )}
          </div>

          {/* Footer */}

          <div
            style={{
              display: "flex",

              justifyContent:
                "flex-end",

              flexWrap: "wrap",

              gap: 12,

              paddingTop: 8,

              borderTop:
                "1px solid #e5e7eb",
            }}
          >
            <Button
              type="button"
              variant="secondary"
              disabled={loading}
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="button"
              loading={loading}
              onClick={
                handleSave
              }
            >
              Save Permissions
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

interface SummaryCardProps {
  label: string;
  value: number;
}

const SummaryCard = ({
  label,
  value,
}: SummaryCardProps) => (
  <div
    style={{
      minWidth: 0,

      padding: 14,

      background:
        "#f8fafc",

      border:
        "1px solid #e5e7eb",

      borderRadius: 10,
    }}
  >
    <div
      style={{
        color:
          "#6b7280",

        fontSize: 12,
      }}
    >
      {label}
    </div>

    <strong
      style={{
        display: "block",

        marginTop: 4,

        color:
          "#111827",

        fontSize: 20,
      }}
    >
      {value}
    </strong>
  </div>
);

export default UserPermissionsModal;