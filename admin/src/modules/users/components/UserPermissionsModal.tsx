import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import type {
  Permission,
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
    permissionUuids: string[],
  ) => Promise<void>;
}

interface PermissionGroup {
  module: string;

  permissions: Permission[];
}

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

const UserPermissionsModal = ({
  open,
  loading,
  permissions,
  allPermissions,
  onClose,
  onSubmit,
}: Props) => {
  const [
    selectedPermissionUuids,
    setSelectedPermissionUuids,
  ] = useState<string[]>([]);

  const [
    search,
    setSearch,
  ] = useState("");

  useEffect(() => {
    if (
      !open ||
      !permissions
    ) {
      return;
    }

    setSelectedPermissionUuids(
      permissions.additionalPermissions.map(
        (permission) =>
          permission.uuid,
      ),
    );

    setSearch("");
  }, [
    open,
    permissions,
  ]);

  const rolePermissionUuids =
    useMemo(
      () =>
        new Set(
          permissions
            ?.rolePermissions
            .map(
              (permission) =>
                permission.uuid,
            ) ?? [],
        ),
      [
        permissions,
      ],
    );

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
            if (!normalizedSearch) {
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

  const handlePermissionChange = (
    permissionUuid: string,
  ) => {
    if (
      rolePermissionUuids.has(
        permissionUuid,
      )
    ) {
      return;
    }

    setSelectedPermissionUuids(
      (previous) =>
        previous.includes(
          permissionUuid,
        )
          ? previous.filter(
              (uuid) =>
                uuid !==
                permissionUuid,
            )
          : [
              ...previous,
              permissionUuid,
            ],
    );
  };

  const handleModuleSelectAll = (
    group: PermissionGroup,
  ) => {
    const selectablePermissions =
      group.permissions.filter(
        (permission) =>
          !rolePermissionUuids.has(
            permission.uuid,
          ),
      );

    if (
      selectablePermissions.length ===
      0
    ) {
      return;
    }

    const allSelected =
      selectablePermissions.every(
        (permission) =>
          selectedPermissionUuids.includes(
            permission.uuid,
          ),
      );

    setSelectedPermissionUuids(
      (previous) => {
        if (allSelected) {
          const modulePermissionUuids =
            new Set(
              selectablePermissions.map(
                (permission) =>
                  permission.uuid,
              ),
            );

          return previous.filter(
            (uuid) =>
              !modulePermissionUuids.has(
                uuid,
              ),
          );
        }

        return Array.from(
          new Set([
            ...previous,

            ...selectablePermissions.map(
              (permission) =>
                permission.uuid,
            ),
          ]),
        );
      },
    );
  };

  const handleSave =
    async () => {
      const additionalPermissions =
        selectedPermissionUuids.filter(
          (uuid) =>
            !rolePermissionUuids.has(
              uuid,
            ),
        );

      await onSubmit(
        additionalPermissions,
      );
    };

  const displayName =
    permissions?.user
      .displayName ??
    permissions?.user
      .employee
      ?.displayName ??
    "User";

  const effectivePermissionCount =
    new Set([
      ...Array.from(
        rolePermissionUuids,
      ),

      ...selectedPermissionUuids,
    ]).size;

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

                  fontSize:
                    14,

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

                fontSize:
                  13,

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
              display:
                "grid",

              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",

              gap:
                12,
            }}
          >
            <div
              style={{
                minWidth: 0,

                padding:
                  14,

                background:
                  "#f8fafc",

                border:
                  "1px solid #e5e7eb",

                borderRadius:
                  10,
              }}
            >
              <div
                style={{
                  color:
                    "#6b7280",

                  fontSize:
                    12,

                  lineHeight:
                    1.4,
                }}
              >
                Role Permissions
              </div>

              <strong
                style={{
                  display:
                    "block",

                  marginTop:
                    4,

                  color:
                    "#111827",

                  fontSize:
                    20,
                }}
              >
                {
                  permissions
                    .rolePermissions
                    .length
                }
              </strong>
            </div>

            <div
              style={{
                minWidth: 0,

                padding:
                  14,

                background:
                  "#f8fafc",

                border:
                  "1px solid #e5e7eb",

                borderRadius:
                  10,
              }}
            >
              <div
                style={{
                  color:
                    "#6b7280",

                  fontSize:
                    12,

                  lineHeight:
                    1.4,
                }}
              >
                Additional Permissions
              </div>

              <strong
                style={{
                  display:
                    "block",

                  marginTop:
                    4,

                  color:
                    "#111827",

                  fontSize:
                    20,
                }}
              >
                {
                  selectedPermissionUuids
                    .length
                }
              </strong>
            </div>

            <div
              style={{
                minWidth: 0,

                padding:
                  14,

                background:
                  "#f8fafc",

                border:
                  "1px solid #e5e7eb",

                borderRadius:
                  10,
              }}
            >
              <div
                style={{
                  color:
                    "#6b7280",

                  fontSize:
                    12,

                  lineHeight:
                    1.4,
                }}
              >
                Effective Permissions
              </div>

              <strong
                style={{
                  display:
                    "block",

                  marginTop:
                    4,

                  color:
                    "#111827",

                  fontSize:
                    20,
                }}
              >
                {
                  effectivePermissionCount
                }
              </strong>
            </div>
          </section>

          {/* Search */}

          <input
            type="search"
            placeholder="Search by permission name, code or module..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            style={{
              width:
                "100%",

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

              fontSize:
                14,

              outline:
                "none",
            }}
          />

          {/* Permission Modules */}

          <div
            style={{
              display:
                "grid",

              gap:
                16,

              maxHeight:
                "55vh",

              overflowY:
                "auto",

              overflowX:
                "hidden",

              paddingRight:
                8,

              paddingBottom:
                4,
            }}
          >
            {groupedPermissions.length ===
            0 ? (
              <div
                style={{
                  padding:
                    32,

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
                  const selectable =
                    group.permissions.filter(
                      (
                        permission,
                      ) =>
                        !rolePermissionUuids.has(
                          permission.uuid,
                        ),
                    );

                  const moduleSelected =
                    selectable.length >
                      0 &&
                    selectable.every(
                      (
                        permission,
                      ) =>
                        selectedPermissionUuids.includes(
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

                          gap:
                            12,

                          padding:
                            "14px 16px",

                          background:
                            "#f8fafc",

                          borderBottom:
                            "1px solid #e5e7eb",

                          borderTopLeftRadius:
                            12,

                          borderTopRightRadius:
                            12,
                        }}
                      >
                        <div>
                          <strong
                            style={{
                              display:
                                "block",

                              color:
                                "#111827",

                              fontSize:
                                15,
                            }}
                          >
                            {formatModuleName(
                              group.module,
                            )}
                          </strong>

                          <span
                            style={{
                              display:
                                "block",

                              marginTop:
                                3,

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
                            {group.permissions
                              .length !==
                            1
                              ? "s"
                              : ""}
                          </span>
                        </div>

                        {selectable.length >
                          0 && (
                          <label
                            style={{
                              display:
                                "flex",

                              alignItems:
                                "center",

                              gap:
                                8,

                              padding:
                                "7px 10px",

                              border:
                                "1px solid #d1d5db",

                              borderRadius:
                                8,

                              background:
                                "#ffffff",

                              color:
                                "#374151",

                              fontSize:
                                13,

                              fontWeight:
                                500,

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

                            Select all
                          </label>
                        )}
                      </div>

                      {/* Permission Rows */}

                      <div
                        style={{
                          display:
                            "grid",

                          gridTemplateColumns:
                            "minmax(0, 1fr)",

                          gap:
                            10,

                          padding:
                            14,
                        }}
                      >
                        {group.permissions.map(
                          (
                            permission,
                          ) => {
                            const inherited =
                              rolePermissionUuids.has(
                                permission.uuid,
                              );

                            const additional =
                              selectedPermissionUuids.includes(
                                permission.uuid,
                              );

                            const checked =
                              inherited ||
                              additional;

                            return (
                              <label
                                key={
                                  permission.uuid
                                }
                                style={{
                                  display:
                                    "grid",

                                  gridTemplateColumns:
                                    "auto minmax(0, 1fr) auto",

                                  alignItems:
                                    "center",

                                  gap:
                                    12,

                                  width:
                                    "100%",

                                  boxSizing:
                                    "border-box",

                                  padding:
                                    "12px 14px",

                                  border:
                                    inherited
                                      ? "1px solid #bfdbfe"
                                      : additional
                                        ? "1px solid #86efac"
                                        : "1px solid #e5e7eb",

                                  borderRadius:
                                    10,

                                  background:
                                    inherited
                                      ? "#eff6ff"
                                      : additional
                                        ? "#f0fdf4"
                                        : "#ffffff",

                                  cursor:
                                    inherited ||
                                    loading
                                      ? "not-allowed"
                                      : "pointer",

                                  opacity:
                                    inherited
                                      ? 0.88
                                      : 1,

                                  transition:
                                    "border-color 0.2s ease, background-color 0.2s ease",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    checked
                                  }
                                  disabled={
                                    inherited ||
                                    loading
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      permission.uuid,
                                    )
                                  }
                                  style={{
                                    width:
                                      17,

                                    height:
                                      17,

                                    margin:
                                      0,

                                    cursor:
                                      inherited ||
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

                                      lineHeight:
                                        1.4,

                                      whiteSpace:
                                        "normal",

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

                                      lineHeight:
                                        1.4,

                                      whiteSpace:
                                        "normal",

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

                                        lineHeight:
                                          1.4,

                                        whiteSpace:
                                          "normal",

                                        overflowWrap:
                                          "anywhere",
                                      }}
                                    >
                                      {
                                        permission.description
                                      }
                                    </div>
                                  )}
                                </div>

                                <span
                                  style={{
                                    padding:
                                      "5px 9px",

                                    borderRadius:
                                      999,

                                    background:
                                      inherited
                                        ? "#dbeafe"
                                        : additional
                                          ? "#dcfce7"
                                          : "#f3f4f6",

                                    color:
                                      inherited
                                        ? "#1d4ed8"
                                        : additional
                                          ? "#15803d"
                                          : "#6b7280",

                                    fontSize:
                                      11,

                                    fontWeight:
                                      600,

                                    whiteSpace:
                                      "nowrap",
                                  }}
                                >
                                  {inherited
                                    ? "Role permission"
                                    : additional
                                      ? "Additional"
                                      : "Available"}
                                </span>
                              </label>
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

          {/* Footer Actions */}

          <div
            style={{
              display:
                "flex",

              justifyContent:
                "flex-end",

              flexWrap:
                "wrap",

              gap:
                12,

              paddingTop:
                8,

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

export default UserPermissionsModal;