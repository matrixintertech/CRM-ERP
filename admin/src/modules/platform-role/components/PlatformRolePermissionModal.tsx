import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";

import type {
  Permission,
} from "../../permission/types/permission.types";

import type {
  PlatformRolePermissionsResponse,
} from "../types/platform-role.types";

interface Props {
  open: boolean;

  loading: boolean;

  rolePermissions:
    | PlatformRolePermissionsResponse
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

  permissions:
    Permission[];
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

const PlatformRolePermissionModal = ({
  open,
  loading,
  rolePermissions,
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

  /*
   * Existing PlatformRole permissions
   * modal open hone par load karo.
   */
  useEffect(() => {
    if (
      !open ||
      !rolePermissions
    ) {
      return;
    }

    setSelectedPermissionUuids(
      rolePermissions.permissions.map(
        (permission) =>
          permission.uuid,
      ),
    );

    setSearch("");
  }, [
    open,
    rolePermissions,
  ]);

  /*
   * Defensive PLATFORM-only filter.
   *
   * Parent page already:
   * getGroupedPermissions("PLATFORM")
   * use kar raha hai.
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
            /*
             * Agar Permission type available hai
             * to PLATFORM only allow karo.
             */
            if (
              permission.type &&
              permission.type !==
                "PLATFORM"
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

  const selectedPermissionSet =
    useMemo(
      () =>
        new Set(
          selectedPermissionUuids,
        ),
      [
        selectedPermissionUuids,
      ],
    );

  /*
   * Single permission toggle.
   */
  const handlePermissionChange = (
    permissionUuid: string,
  ) => {
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

  /*
   * Module select all.
   */
  const handleModuleSelectAll = (
    group: PermissionGroup,
  ) => {
    const allSelected =
      group.permissions.every(
        (permission) =>
          selectedPermissionSet.has(
            permission.uuid,
          ),
      );

    setSelectedPermissionUuids(
      (previous) => {
        if (
          allSelected
        ) {
          const modulePermissionUuids =
            new Set(
              group.permissions.map(
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

            ...group.permissions.map(
              (permission) =>
                permission.uuid,
            ),
          ]),
        );
      },
    );
  };

  /*
   * Select all visible/search results.
   */
  const visiblePermissions =
    useMemo(
      () =>
        groupedPermissions.flatMap(
          (group) =>
            group.permissions,
        ),
      [
        groupedPermissions,
      ],
    );

  const allVisibleSelected =
    visiblePermissions.length >
      0 &&
    visiblePermissions.every(
      (permission) =>
        selectedPermissionSet.has(
          permission.uuid,
        ),
    );

  const handleSelectAllVisible =
    () => {
      if (
        visiblePermissions.length ===
        0
      ) {
        return;
      }

      setSelectedPermissionUuids(
        (previous) => {
          if (
            allVisibleSelected
          ) {
            const visibleUuids =
              new Set(
                visiblePermissions.map(
                  (permission) =>
                    permission.uuid,
                ),
              );

            return previous.filter(
              (uuid) =>
                !visibleUuids.has(
                  uuid,
                ),
            );
          }

          return Array.from(
            new Set([
              ...previous,

              ...visiblePermissions.map(
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
      await onSubmit(
        selectedPermissionUuids,
      );
    };

  const roleName =
    rolePermissions
      ?.role.name ??
    "Platform Role";

return (
  <Modal
    open={open}
    title="Platform Role Permissions"
    onClose={onClose}
    size="lg"
  >
    {loading &&
    !rolePermissions ? (
      <p>
        Loading permissions...
      </p>
    ) : !rolePermissions ? (
      <p>
        Platform role permission
        information not found.
      </p>
    ) : (
      <div
        style={{
          display:
            "flex",

          flexDirection:
            "column",

          gap:
            20,

          /*
           * Modal ke andar definite
           * available height create karo.
           *
           * Isse middle permission area
           * proper scrollable banega.
           */
          height:
            "min(720px, calc(100vh - 180px))",

          minHeight:
            0,

          overflow:
            "hidden",
        }}
      >
        {/* Header */}

        <section
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

            paddingBottom:
              16,

            borderBottom:
              "1px solid #e5e7eb",

            /*
             * Header scroll-area me
             * shrink nahi hoga.
             */
            flexShrink:
              0,
          }}
        >
          <div>
            <h3
              style={{
                margin:
                  "0 0 5px",

                color:
                  "#111827",
              }}
            >
              {roleName}
            </h3>

            <div
              style={{
                color:
                  "#6b7280",

                fontSize:
                  13,
              }}
            >
              {
                rolePermissions
                  .role.code
              }
            </div>
          </div>

          <div
            style={{
              padding:
                "7px 11px",

              border:
                "1px solid #ddd6fe",

              borderRadius:
                999,

              background:
                "#f5f3ff",

              color:
                "#6d28d9",

              fontSize:
                12,

              fontWeight:
                600,
            }}
          >
            PLATFORM
          </div>
        </section>

        {/* Summary */}

        <section
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",

            gap:
              12,

            flexShrink:
              0,
          }}
        >
          <SummaryCard
            label="Available Permissions"
            value={
              allPermissions.length
            }
          />

          <SummaryCard
            label="Assigned Permissions"
            value={
              selectedPermissionUuids
                .length
            }
          />
        </section>

        {/* Search + Select All */}

        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "minmax(0, 1fr) auto",

            alignItems:
              "center",

            gap:
              12,

            flexShrink:
              0,
          }}
        >
          <input
            type="search"
            placeholder="Search by permission name, code or module..."
            value={search}
            onChange={(
              event,
            ) =>
              setSearch(
                event.target
                  .value,
              )
            }
            style={{
              width:
                "100%",

              boxSizing:
                "border-box",

              padding:
                "11px 13px",

              border:
                "1px solid #d1d5db",

              borderRadius:
                8,

              color:
                "#111827",

              fontSize:
                14,

              outline:
                "none",
            }}
          />

          <label
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                8,

              padding:
                "9px 11px",

              border:
                "1px solid #d1d5db",

              borderRadius:
                8,

              color:
                "#374151",

              fontSize:
                13,

              whiteSpace:
                "nowrap",

              cursor:
                loading
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={
                allVisibleSelected
              }
              disabled={
                loading ||
                visiblePermissions.length ===
                  0
              }
              onChange={
                handleSelectAllVisible
              }
            />

            Select visible
          </label>
        </div>

        {/* Permission Groups */}

        <div
          style={{
            /*
             * Ye main scrollable area hai.
             */
            flex:
              "1 1 auto",

            minHeight:
              0,

            overflowY:
              "auto",

            overflowX:
              "hidden",

            paddingRight:
              8,

            paddingBottom:
              8,

            overscrollBehavior:
              "contain",

            /*
             * Groups ko vertical stack
             * me maintain karo.
             */
            display:
              "flex",

            flexDirection:
              "column",

            gap:
              16,

            scrollbarGutter:
              "stable",
          }}
        >
          {groupedPermissions.length ===
          0 ? (
            <div
              style={{
                padding:
                  30,

                border:
                  "1px dashed #d1d5db",

                borderRadius:
                  10,

                color:
                  "#6b7280",

                textAlign:
                  "center",

                flexShrink:
                  0,
              }}
            >
              No platform permissions
              found.
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
                      selectedPermissionSet.has(
                        permission.uuid,
                      ),
                  );

                const selectedCount =
                  group.permissions.filter(
                    (
                      permission,
                    ) =>
                      selectedPermissionSet.has(
                        permission.uuid,
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
                        11,

                      background:
                        "#ffffff",

                      overflow:
                        "hidden",

                      /*
                       * Important:
                       * group shrink nahi hoga.
                       *
                       * Pehle flex/grid layout
                       * available height me
                       * cards compress kar sakta tha.
                       */
                      flexShrink:
                        0,
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
                          "13px 15px",

                        background:
                          "#f8fafc",

                        borderBottom:
                          "1px solid #e5e7eb",
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
                              14,
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
                            selectedCount
                          }
                          /
                          {
                            group
                              .permissions
                              .length
                          }{" "}
                          selected
                        </span>
                      </div>

                      <label
                        style={{
                          display:
                            "flex",

                          alignItems:
                            "center",

                          gap:
                            8,

                          cursor:
                            loading
                              ? "not-allowed"
                              : "pointer",

                          color:
                            "#374151",

                          fontSize:
                            13,
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
                    </div>

                    {/* Permissions */}

                    <div
                      style={{
                        display:
                          "grid",

                        gap:
                          8,

                        padding:
                          13,
                      }}
                    >
                      {group.permissions.map(
                        (
                          permission,
                        ) => {
                          const checked =
                            selectedPermissionSet.has(
                              permission.uuid,
                            );

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

                                padding:
                                  "11px 13px",

                                border:
                                  checked
                                    ? "1px solid #c4b5fd"
                                    : "1px solid #e5e7eb",

                                borderRadius:
                                  9,

                                background:
                                  checked
                                    ? "#f5f3ff"
                                    : "#ffffff",

                                cursor:
                                  loading
                                    ? "not-allowed"
                                    : "pointer",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={
                                  checked
                                }
                                disabled={
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
                                      3,

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
                                        3,

                                      color:
                                        "#9ca3af",

                                      fontSize:
                                        12,

                                      lineHeight:
                                        1.4,
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
                                    "4px 8px",

                                  borderRadius:
                                    999,

                                  background:
                                    checked
                                      ? "#ede9fe"
                                      : "#f3f4f6",

                                  color:
                                    checked
                                      ? "#6d28d9"
                                      : "#6b7280",

                                  fontSize:
                                    11,

                                  fontWeight:
                                    600,

                                  whiteSpace:
                                    "nowrap",
                                }}
                              >
                                {checked
                                  ? "Assigned"
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

        {/* Footer */}

        <div
          style={{
            display:
              "flex",

            justifyContent:
              "flex-end",

            flexWrap:
              "wrap",

            gap:
              10,

            paddingTop:
              10,

            borderTop:
              "1px solid #e5e7eb",

            flexShrink:
              0,
          }}
        >
          <Button
            type="button"
            variant="secondary"
            disabled={
              loading
            }
            onClick={
              onClose
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            loading={
              loading
            }
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
      padding:
        13,

      border:
        "1px solid #e5e7eb",

      borderRadius:
        9,

      background:
        "#f8fafc",
    }}
  >
    <div
      style={{
        color:
          "#6b7280",

        fontSize:
          12,
      }}
    >
      {label}
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
      {value}
    </strong>
  </div>
);

export default PlatformRolePermissionModal;