import {
  useMemo,
  useState,
} from "react";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  useDocumentTitle,
} from "@/shared/hooks/useDocumentTitle";

import {
  useAuthorization,
} from "@/shared/hooks/useAuthorization";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import {
  getGroupedPermissions,
} from "../../permission/api/permission.api";

import {
  usePlatformRoles,
} from "../hooks/usePlatformRoles";

import PlatformRoleModal from "../components/PlatformRoleModal";
import PlatformRolePermissionModal from "../components/PlatformRolePermissionModal";

import type {
  PlatformRole,
  PlatformRoleFormData,
  PlatformRolePermissionsResponse,
  PlatformRoleStatus,
} from "../types/platform-role.types";


const PlatformRolePage = () => {
  useDocumentTitle(
    "Platform Roles",
  );


  const {
    hasPermission,
  } = useAuthorization();


  const canCreate =
    hasPermission(
      "platform.platform_role.create",
    );

  const canUpdate =
    hasPermission(
      "platform.platform_role.update",
    );

  const canDelete =
    hasPermission(
      "platform.platform_role.delete",
    );

const canViewPermissionCatalog =
  hasPermission(
    "platform.permission.view",
  );

/*
 * Platform role permissions manage
 * karna role update operation hai.
 *
 * platform.permission.view accidentally
 * remove hone par bhi role permission
 * management accessible rehna chahiye,
 * warna self-lockout ho sakta hai.
 */
const canManagePermissions =
  canUpdate


  const [
    searchValue,
    setSearchValue,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState<
    PlatformRoleStatus | ""
  >("");

  const [
    query,
    setQuery,
  ] = useState<{
    search?: string;

    status?:
      PlatformRoleStatus;
  }>({});


  const {
    roles,

    loading,
    fetching,

    fetchRole,
    fetchPermissions,

    createRole,
    updateRole,
    deleteRole,
    savePermissions,

    creating,
    updating,
    deleting,
    savingPermissions,
  } = usePlatformRoles(
    query,
  );


  /*
   * PLATFORM permissions only.
   *
   * Permission catalog tabhi load
   * hoga jab current user role
   * permissions manage kar sakta hai.
   */
  const groupedPermissionsQuery =
    useQuery({
      queryKey: [
        "platform-grouped-permissions",
        "PLATFORM",
      ],

      queryFn: () =>
        getGroupedPermissions(
          "PLATFORM",
        ),

      enabled:
        canManagePermissions,

      staleTime:
        5 * 60 * 1000,
    });


  const allPermissions =
    useMemo(
      () =>
        groupedPermissionsQuery
          .data
          ?.flatMap(
            (group) =>
              group.permissions,
          ) ?? [],
      [
        groupedPermissionsQuery
          .data,
      ],
    );


  /*
   * Create/Edit modal state.
   */
  const [
    openRoleModal,
    setOpenRoleModal,
  ] = useState(false);

  const [
    selectedRole,
    setSelectedRole,
  ] = useState<
    PlatformRole | null
  >(null);


  /*
   * Permission modal state.
   */
  const [
    openPermissionModal,
    setOpenPermissionModal,
  ] = useState(false);

  const [
    permissionRoleUuid,
    setPermissionRoleUuid,
  ] = useState<
    string | null
  >(null);

  const [
    rolePermissions,
    setRolePermissions,
  ] = useState<
    PlatformRolePermissionsResponse | null
  >(null);


  /*
   * Search/filter.
   */
  const handleSearch = () => {
    setQuery({
      search:
        searchValue.trim() ||
        undefined,

      status:
        status ||
        undefined,
    });
  };


  const handleReset = () => {
    setSearchValue(
      "",
    );

    setStatus(
      "",
    );

    setQuery({});
  };


  /*
   * Create role.
   */
  const handleCreate = () => {
    if (!canCreate) {
      return;
    }

    setSelectedRole(
      null,
    );

    setOpenRoleModal(
      true,
    );
  };


  /*
   * Edit role.
   */
  const handleEdit =
    async (
      uuid: string,
    ) => {
      if (!canUpdate) {
        return;
      }

      setSelectedRole(
        null,
      );

      try {
        const role =
          await fetchRole(
            uuid,
          );

        setSelectedRole(
          role,
        );

        setOpenRoleModal(
          true,
        );
      } catch {
        setOpenRoleModal(
          false,
        );
      }
    };


  /*
   * Create/update submit.
   */
  const handleRoleSubmit =
    async (
      formData:
        PlatformRoleFormData,
    ) => {
      if (selectedRole) {
        if (!canUpdate) {
          return;
        }

        await updateRole(
          selectedRole.uuid,
          {
            name:
              formData.name
                .trim(),

            code:
              formData.code
                .trim()
                .toUpperCase(),

            description:
              formData.description
                ?.trim() ||
              undefined,

            status:
              formData.status,
          },
        );
      } else {
        if (!canCreate) {
          return;
        }

        await createRole({
          name:
            formData.name
              .trim(),

          code:
            formData.code
              .trim()
              .toUpperCase(),

          description:
            formData.description
              ?.trim() ||
            undefined,
        });
      }

      setOpenRoleModal(
        false,
      );

      setSelectedRole(
        null,
      );
    };


  /*
   * Soft delete.
   */
  const handleDelete =
    async (
      role:
        PlatformRole,
    ) => {
      if (
        !canDelete ||
        role.isSystem
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          `Delete platform role "${role.name}"?`,
        );

      if (!confirmed) {
        return;
      }

      await deleteRole(
        role.uuid,
      );
    };


  /*
   * Open permissions.
   */
  const handlePermissions =
    async (
      uuid: string,
    ) => {
      if (
        !canManagePermissions
      ) {
        return;
      }

      setPermissionRoleUuid(
        uuid,
      );

      setRolePermissions(
        null,
      );

      setOpenPermissionModal(
        true,
      );

      try {
        const response =
          await fetchPermissions(
            uuid,
          );

        setRolePermissions(
          response,
        );
      } catch {
        setOpenPermissionModal(
          false,
        );

        setPermissionRoleUuid(
          null,
        );

        setRolePermissions(
          null,
        );
      }
    };


  /*
   * Save permissions.
   *
   * PlatformRolePermission
   * has no scope.
   */
  const handleSavePermissions =
    async (
      permissionUuids:
        string[],
    ) => {
      if (
        !permissionRoleUuid ||
        !canManagePermissions
      ) {
        return;
      }

      const response =
        await savePermissions(
          permissionRoleUuid,
          {
            permissionUuids,
          },
        );

      setRolePermissions(
        response,
      );

      setOpenPermissionModal(
        false,
      );

      setPermissionRoleUuid(
        null,
      );

      setRolePermissions(
        null,
      );
    };


  const roleModalLoading =
    creating ||
    updating;


  const permissionModalLoading =
    savingPermissions ||
    (
      openPermissionModal &&
      (
        !rolePermissions ||
        groupedPermissionsQuery
          .isLoading
      )
    );


  const backgroundFetching =
    fetching &&
    !loading;


  /*
   * Actions column tabhi dikhani hai
   * jab current user ke paas at least
   * ek role-management action ho.
   */
  const hasRoleActions =
    canManagePermissions ||
    canUpdate ||
    canDelete;


  const tableColumnCount =
    hasRoleActions
      ? 6
      : 5;


  return (
    <>
      <PageHeader
        title="Platform Roles"
        subtitle="Manage platform-level roles and permissions"
        actions={
          canCreate ? (
            <Button
              type="button"
              onClick={
                handleCreate
              }
            >
              Add Platform Role
            </Button>
          ) : undefined
        }
      />


      <Card>
        {/* Filters */}

        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "minmax(220px, 1fr) minmax(180px, 220px) auto auto",

            alignItems:
              "end",

            gap:
              12,

            marginBottom:
              24,
          }}
        >
          <Input
            label="Search"
            placeholder="Role name or code"
            value={
              searchValue
            }
            onChange={(
              event,
            ) =>
              setSearchValue(
                event.target
                  .value,
              )
            }
            onKeyDown={(
              event,
            ) => {
              if (
                event.key ===
                "Enter"
              ) {
                handleSearch();
              }
            }}
          />

          <Select
            label="Status"
            value={
              status
            }
            options={[
              {
                label:
                  "All Statuses",

                value:
                  "",
              },

              {
                label:
                  "Active",

                value:
                  "ACTIVE",
              },

              {
                label:
                  "Inactive",

                value:
                  "INACTIVE",
              },
            ]}
            onChange={(
              event,
            ) =>
              setStatus(
                event.target
                  .value as
                  | PlatformRoleStatus
                  | "",
              )
            }
          />

          <Button
            type="button"
            loading={
              loading
            }
            onClick={
              handleSearch
            }
          >
            Search
          </Button>

          <Button
            type="button"
            variant="secondary"
            disabled={
              loading
            }
            onClick={
              handleReset
            }
          >
            Reset
          </Button>
        </div>


        {backgroundFetching && (
          <div
            style={{
              marginBottom:
                12,

              color:
                "#6b7280",

              fontSize:
                12,
            }}
          >
            Updating platform roles...
          </div>
        )}


        {/* Role Table */}

        <div
          style={{
            overflowX:
              "auto",
          }}
        >
          <table
            style={{
              width:
                "100%",

              borderCollapse:
                "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  style={
                    headerCellStyle
                  }
                >
                  Name
                </th>

                <th
                  style={
                    headerCellStyle
                  }
                >
                  Code
                </th>

                <th
                  style={
                    headerCellStyle
                  }
                >
                  Type
                </th>

                <th
                  style={
                    headerCellStyle
                  }
                >
                  Status
                </th>

                <th
                  style={
                    headerCellStyle
                  }
                >
                  Users
                </th>

                {hasRoleActions && (
                  <th
                    style={{
                      ...headerCellStyle,

                      textAlign:
                        "right",
                    }}
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={
                      tableColumnCount
                    }
                    style={
                      emptyCellStyle
                    }
                  >
                    Loading platform roles...
                  </td>
                </tr>
              ) : roles.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={
                      tableColumnCount
                    }
                    style={
                      emptyCellStyle
                    }
                  >
                    No platform roles found.
                  </td>
                </tr>
              ) : (
                roles.map(
                  (
                    role,
                  ) => (
                    <tr
                      key={
                        role.uuid
                      }
                    >
                      <td
                        style={
                          bodyCellStyle
                        }
                      >
                        <div
                          style={{
                            fontWeight:
                              600,

                            color:
                              "#111827",
                          }}
                        >
                          {
                            role.name
                          }
                        </div>

                        {role.description && (
                          <div
                            style={{
                              marginTop:
                                4,

                              maxWidth:
                                360,

                              color:
                                "#6b7280",

                              fontSize:
                                12,
                            }}
                          >
                            {
                              role.description
                            }
                          </div>
                        )}
                      </td>

                      <td
                        style={
                          bodyCellStyle
                        }
                      >
                        <code>
                          {
                            role.code
                          }
                        </code>
                      </td>

                      <td
                        style={
                          bodyCellStyle
                        }
                      >
                        <span
                          style={{
                            padding:
                              "5px 9px",

                            borderRadius:
                              999,

                            background:
                              role.isSystem
                                ? "#fef3c7"
                                : "#f3f4f6",

                            color:
                              role.isSystem
                                ? "#92400e"
                                : "#374151",

                            fontSize:
                              11,

                            fontWeight:
                              600,
                          }}
                        >
                          {role.isSystem
                            ? "System"
                            : "Custom"}
                        </span>
                      </td>

                      <td
                        style={
                          bodyCellStyle
                        }
                      >
                        <span
                          style={{
                            padding:
                              "5px 9px",

                            borderRadius:
                              999,

                            background:
                              role.status ===
                              "ACTIVE"
                                ? "#dcfce7"
                                : "#f3f4f6",

                            color:
                              role.status ===
                              "ACTIVE"
                                ? "#15803d"
                                : "#6b7280",

                            fontSize:
                              11,

                            fontWeight:
                              600,
                          }}
                        >
                          {
                            role.status
                          }
                        </span>
                      </td>

                      <td
                        style={
                          bodyCellStyle
                        }
                      >
                        {
                          role._count
                            ?.users ??
                          0
                        }
                      </td>


                      {hasRoleActions && (
                        <td
                          style={{
                            ...bodyCellStyle,

                            textAlign:
                              "right",
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",

                              justifyContent:
                                "flex-end",

                              flexWrap:
                                "wrap",

                              gap:
                                8,
                            }}
                          >
                            {canManagePermissions && (
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() =>
                                  handlePermissions(
                                    role.uuid,
                                  )
                                }
                              >
                                Permissions
                              </Button>
                            )}

                            {canUpdate && (
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() =>
                                  handleEdit(
                                    role.uuid,
                                  )
                                }
                              >
                                Edit
                              </Button>
                            )}

                            {canDelete &&
                              !role.isSystem && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="danger"
                                  disabled={
                                    deleting
                                  }
                                  onClick={() =>
                                    handleDelete(
                                      role,
                                    )
                                  }
                                >
                                  Delete
                                </Button>
                              )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ),
                )
              )}
            </tbody>
          </table>
        </div>
      </Card>


      {/* Create / Edit */}

      {(canCreate ||
        canUpdate) && (
        <PlatformRoleModal
          open={
            openRoleModal
          }
          loading={
            roleModalLoading
          }
          role={
            selectedRole
          }
          onClose={() => {
            setOpenRoleModal(
              false,
            );

            setSelectedRole(
              null,
            );
          }}
          onSubmit={
            handleRoleSubmit
          }
        />
      )}


      {/* Permissions */}

      {canManagePermissions && (
        <PlatformRolePermissionModal
          open={
            openPermissionModal
          }
          loading={
            permissionModalLoading
          }
          rolePermissions={
            rolePermissions
          }
          allPermissions={
            allPermissions
          }
          onClose={() => {
            setOpenPermissionModal(
              false,
            );

            setPermissionRoleUuid(
              null,
            );

            setRolePermissions(
              null,
            );
          }}
          onSubmit={
            handleSavePermissions
          }
        />
      )}
    </>
  );
};


const headerCellStyle = {
  padding:
    "12px 14px",

  borderBottom:
    "1px solid #e5e7eb",

  background:
    "#f8fafc",

  color:
    "#374151",

  fontSize:
    12,

  fontWeight:
    600,

  textAlign:
    "left" as const,

  whiteSpace:
    "nowrap" as const,
};


const bodyCellStyle = {
  padding:
    "14px",

  borderBottom:
    "1px solid #e5e7eb",

  color:
    "#374151",

  fontSize:
    14,

  verticalAlign:
    "middle" as const,
};


const emptyCellStyle = {
  padding:
    "32px 16px",

  color:
    "#6b7280",

  textAlign:
    "center" as const,
};


export default PlatformRolePage;