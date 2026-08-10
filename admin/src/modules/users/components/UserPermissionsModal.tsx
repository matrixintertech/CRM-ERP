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

  permissions:
    Permission[];
}

const scopeOptions: Array<{
  value: PermissionScope;
  label: string;
}> = [
  {
    value: "OWN",
    label: "Own",
  },
  {
    value: "TEAM",
    label: "Team",
  },
  {
    value: "ORGANIZATION_UNIT",
    label: "Organization Unit",
  },
  {
    value: "PROJECT",
    label: "Project",
  },
  {
    value: "COMPANY",
    label: "Company",
  },
];

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
  scopeOptions.find(
    (option) =>
      option.value === scope,
  )?.label ?? scope;

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
   * Existing direct user grants load karo.
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
   * Role permission lookup.
   *
   * Role grant informational hai.
   * Same permission direct user grant
   * ke through bhi assign ho sakti hai.
   */
  const rolePermissionMap =
    useMemo(
      () =>
        new Map(
          (
            permissions
              ?.rolePermissions ??
            []
          ).map(
            (permission) => [
              permission.uuid,
              permission,
            ],
          ),
        ),
      [
        permissions,
      ],
    );

  const selectedPermissionMap =
    useMemo(
      () =>
        new Map(
          selectedPermissions.map(
            (permission) => [
              permission.permissionUuid,
              permission,
            ],
          ),
        ),
      [
        selectedPermissions,
      ],
    );

  /*
   * Only company permissions show karo.
   *
   * type optional hai backward
   * compatibility ke liye.
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
              permission.type &&
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
   * Checkbox represents DIRECT user grant.
   *
   * Role permission checkbox ko block
   * nahi karegi.
   */
  const handlePermissionChange = (
    permissionUuid: string,
  ) => {
    setSelectedPermissions(
      (previous) => {
        const exists =
          previous.some(
            (permission) =>
              permission.permissionUuid ===
              permissionUuid,
          );

        if (exists) {
          return previous.filter(
            (permission) =>
              permission.permissionUuid !==
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
          (permission) =>
            permission.permissionUuid ===
            permissionUuid
              ? {
                  ...permission,

                  scope,
                }
              : permission,
        ),
    );
  };

  /*
   * Select all = direct grants.
   *
   * Existing scopes preserve rahenge.
   * New grants default OWN honge.
   */
  const handleModuleSelectAll = (
    group: PermissionGroup,
  ) => {
    const allSelected =
      group.permissions.every(
        (permission) =>
          selectedPermissionMap.has(
            permission.uuid,
          ),
      );

    setSelectedPermissions(
      (previous) => {
        if (allSelected) {
          const modulePermissionUuids =
            new Set(
              group.permissions.map(
                (permission) =>
                  permission.uuid,
              ),
            );

          return previous.filter(
            (permission) =>
              !modulePermissionUuids.has(
                permission.permissionUuid,
              ),
          );
        }

        const existingUuids =
          new Set(
            previous.map(
              (permission) =>
                permission.permissionUuid,
            ),
          );

        const additions =
          group.permissions
            .filter(
              (permission) =>
                !existingUuids.has(
                  permission.uuid,
                ),
            )
            .map(
              (permission) => ({
                permissionUuid:
                  permission.uuid,

                scope:
                  "OWN" as PermissionScope,
              }),
            );

        return [
          ...previous,
          ...additions,
        ];
      },
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
   * Effective grants scope-wise count.
   *
   * Same permission:
   * ROLE OWN + USER PROJECT
   * = 2 effective grants.
   */
  const effectivePermissionCount =
    useMemo(
      () => {
        const grants =
          new Set<string>();

        for (
          const permission
          of permissions
            ?.rolePermissions ??
          []
        ) {
          grants.add(
            `${permission.uuid}:${permission.scope}`,
          );
        }

        for (
          const permission
          of selectedPermissions
        ) {
          grants.add(
            `${permission.permissionUuid}:${permission.scope}`,
          );
        }

        return grants.size;
      },
      [
        permissions,
        selectedPermissions,
      ],
    );

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
              alignItems: "center",
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
              label="Role Permissions"
              value={
                permissions
                  .rolePermissions
                  .length
              }
            />

            <SummaryCard
              label="Additional Permissions"
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
                  const moduleSelected =
                    group.permissions
                      .length >
                      0 &&
                    group.permissions.every(
                      (
                        permission,
                      ) =>
                        selectedPermissionMap.has(
                          permission.uuid,
                        ),
                    );

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
                          </span>
                        </div>

                        <label
                          style={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            gap: 8,

                            cursor:
                              loading
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={
                              moduleSelected
                            }
                            disabled={
                              loading
                            }
                            onChange={() =>
                              handleModuleSelectAll(
                                group,
                              )
                            }
                          />

                          Direct grant all
                        </label>
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
                            const rolePermission =
                              rolePermissionMap.get(
                                permission.uuid,
                              );

                            const additionalPermission =
                              selectedPermissionMap.get(
                                permission.uuid,
                              );

                            const additional =
                              Boolean(
                                additionalPermission,
                              );

                            return (
                              <div
                                key={
                                  permission.uuid
                                }
                                style={{
                                  display:
                                    "grid",

                                  gridTemplateColumns:
                                    "auto minmax(0, 1fr) minmax(150px, 190px)",

                                  alignItems:
                                    "center",

                                  gap: 12,

                                  width:
                                    "100%",

                                  boxSizing:
                                    "border-box",

                                  padding:
                                    "12px 14px",

                                  border:
                                    additional
                                      ? "1px solid #86efac"
                                      : rolePermission
                                        ? "1px solid #bfdbfe"
                                        : "1px solid #e5e7eb",

                                  borderRadius:
                                    10,

                                  background:
                                    additional
                                      ? "#f0fdf4"
                                      : rolePermission
                                        ? "#eff6ff"
                                        : "#ffffff",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    additional
                                  }
                                  disabled={
                                    loading
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      permission.uuid,
                                    )
                                  }
                                  title="Assign direct user permission"
                                  style={{
                                    width:
                                      17,

                                    height:
                                      17,

                                    margin:
                                      0,

                                    cursor:
                                      loading
                                        ? "not-allowed"
                                        : "pointer",
                                  }}
                                />

                                <div
                                  style={{
                                    minWidth:
                                      0,
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

                                  <div
                                    style={{
                                      display:
                                        "flex",

                                      flexWrap:
                                        "wrap",

                                      gap: 6,

                                      marginTop:
                                        8,
                                    }}
                                  >
                                    {rolePermission && (
                                      <span
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
                                        Role:{" "}
                                        {formatScope(
                                          rolePermission.scope,
                                        )}
                                      </span>
                                    )}

                                    {additionalPermission && (
                                      <span
                                        style={{
                                          padding:
                                            "4px 8px",

                                          borderRadius:
                                            999,

                                          background:
                                            "#dcfce7",

                                          color:
                                            "#15803d",

                                          fontSize:
                                            11,

                                          fontWeight:
                                            600,
                                        }}
                                      >
                                        Direct grant
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <select
                                  value={
                                    additionalPermission
                                      ?.scope ??
                                    "OWN"
                                  }
                                  disabled={
                                    !additional ||
                                    loading
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    handleScopeChange(
                                      permission.uuid,

                                      event.target
                                        .value as PermissionScope,
                                    )
                                  }
                                  style={{
                                    width:
                                      "100%",

                                    boxSizing:
                                      "border-box",

                                    padding:
                                      "9px 10px",

                                    border:
                                      "1px solid #d1d5db",

                                    borderRadius:
                                      8,

                                    background:
                                      additional
                                        ? "#ffffff"
                                        : "#f3f4f6",

                                    color:
                                      "#374151",
                                  }}
                                >
                                  {scopeOptions.map(
                                    (
                                      option,
                                    ) => (
                                      <option
                                        key={
                                          option.value
                                        }
                                        value={
                                          option.value
                                        }
                                      >
                                        {
                                          option.label
                                        }
                                      </option>
                                    ),
                                  )}
                                </select>
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

              flexWrap:
                "wrap",

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