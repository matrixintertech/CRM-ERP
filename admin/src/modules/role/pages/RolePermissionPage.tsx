import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useQuery,
} from "@tanstack/react-query";

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
  getRolePermissionCatalog,
} from "../api/role.api";

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
   * Dedicated COMPANY permission
   * catalog for Role Permission
   * Management.
   *
   * Backend:
   *
   * GET /roles/permissions/catalog
   *
   * Permission:
   * company.role.update
   *
   * This intentionally does NOT use:
   * /company/permissions/grouped
   *
   * and does NOT depend on:
   * company.permission.view
   */
  const permissionCatalogQuery =
    useQuery({
      queryKey: [
        "company-role-permission-catalog",
      ],

      queryFn:
        getRolePermissionCatalog,

      staleTime:
        5 * 60 * 1000,
    });


  const groupedPermissions:
    PermissionGroup[] =
    permissionCatalogQuery.data ??
    [];


  const permissionLoading =
    permissionCatalogQuery.isLoading;


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
   * Selected permissions store
   * permission UUID + selected scope.
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


  /*
   * Load permissions currently
   * assigned to selected role.
   */
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
                (
                  permission,
                ) => ({
                  permissionUuid:
                    permission.uuid,

                  scope:
                    permission.scope,
                }),
              ) ?? [];


          setSelectedPermissions(
            permissions.map(
              (
                permission,
              ) => ({
                ...permission,
              }),
            ),
          );


          setInitialPermissions(
            permissions.map(
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
   * Selected permission UUIDs.
   */
  const selectedPermissionUuids =
    useMemo(
      () =>
        selectedPermissions.map(
          (
            permission,
          ) =>
            permission.permissionUuid,
        ),
      [
        selectedPermissions,
      ],
    );


  /*
   * Fast lookup:
   *
   * permissionUuid
   * ->
   * selected scope
   */
  const permissionScopes =
    useMemo(
      () =>
        Object.fromEntries(
          selectedPermissions.map(
            (
              permission,
            ) => [
              permission.permissionUuid,
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


  /*
   * Search/filter permission groups.
   */
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
            group.permissions.length >
            0,
        );
    }, [
      groupedPermissions,
      search,
    ]);


  /*
   * Fast permission lookup.
   *
   * Isse kisi permission ka
   * allowedScopes easily mil jayega.
   */
  const permissionByUuid =
    useMemo(() => {
      return new Map(
        groupedPermissions.flatMap(
          (
            group,
          ) =>
            group.permissions.map(
              (
                permission,
              ) =>
                [
                  permission.uuid,
                  permission,
                ] as const,
            ),
        ),
      );
    }, [
      groupedPermissions,
    ]);


  /*
   * Jab permission first time
   * select hoti hai, uska first
   * configured allowed scope
   * default selected hoga.
   *
   * Example:
   *
   * Project Category:
   * [COMPANY]
   * -> COMPANY
   *
   * Project:
   * [PROJECT, COMPANY]
   * -> PROJECT
   */
  const getDefaultScope = (
    permissionUuid: string,
  ): PermissionScope | null => {
    const permission =
      permissionByUuid.get(
        permissionUuid,
      );


    const allowedScopes =
      permission?.allowedScopes ??
      [];


    return (
      allowedScopes[0] ??
      null
    );
  };


  /*
   * All permissions count.
   */
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


  /*
   * Visible permissions which can
   * actually be assigned.
   *
   * COMPANY permission with
   * allowedScopes = []
   * is not selectable.
   */
  const visiblePermissions =
    useMemo(
      () =>
        filteredGroups.flatMap(
          (
            group:
              PermissionGroup,
          ) =>
            group.permissions.filter(
              (
                permission,
              ) =>
                (
                  permission
                    .allowedScopes
                    ?.length ??
                  0
                ) >
                0,
            ),
        ),
      [
        filteredGroups,
      ],
    );


  const visiblePermissionUuids =
    useMemo(
      () =>
        visiblePermissions.map(
          (
            permission,
          ) =>
            permission.uuid,
        ),
      [
        visiblePermissions,
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
   * Permission + scope both
   * compare karo.
   *
   * Scope change bhi Save
   * enable karega.
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


  /*
   * Single permission toggle.
   */
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


        const defaultScope =
          getDefaultScope(
            permissionUuid,
          );


        /*
         * allowedScopes configured
         * nahi hai to permission
         * assign nahi hogi.
         */
        if (!defaultScope) {
          return previous;
        }


        return [
          ...previous,

          {
            permissionUuid,

            scope:
              defaultScope,
          },
        ];
      },
    );
  };


  /*
   * Selected permission ka
   * scope change.
   */
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


  /*
   * Whole module/group toggle.
   */
  const toggleGroup = (
    group:
      PermissionGroup,
  ) => {
    /*
     * Empty allowedScopes wale
     * permissions selectable nahi hain.
     */
    const selectablePermissions =
      group.permissions.filter(
        (
          permission,
        ) =>
          (
            permission
              .allowedScopes
              ?.length ??
            0
          ) >
          0,
      );


    const groupPermissionUuids =
      selectablePermissions.map(
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
          [];


        for (
          const permission
          of selectablePermissions
        ) {
          if (
            alreadySelected.has(
              permission.uuid,
            )
          ) {
            continue;
          }


          const defaultScope =
            getDefaultScope(
              permission.uuid,
            );


          if (!defaultScope) {
            continue;
          }


          newPermissions.push({
            permissionUuid:
              permission.uuid,

            scope:
              defaultScope,
          });
        }


        return [
          ...previous,
          ...newPermissions,
        ];
      },
    );
  };


  /*
   * Select/Clear all currently
   * visible permissions.
   */
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
            visiblePermissionUuids.length >
              0 &&
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
            [];


          for (
            const permission
            of visiblePermissions
          ) {
            if (
              selectedUuids.has(
                permission.uuid,
              )
            ) {
              continue;
            }


            const defaultScope =
              getDefaultScope(
                permission.uuid,
              );


            if (!defaultScope) {
              continue;
            }


            newPermissions.push({
              permissionUuid:
                permission.uuid,

              scope:
                defaultScope,
            });
          }


          return [
            ...previous,
            ...newPermissions,
          ];
        },
      );
    };


  /*
   * Save role permissions.
   */
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


  /*
   * Restore last saved state.
   */
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

              gap:
                12,

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

            gap:
              20,
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

              gap:
                16,

              flexWrap:
                "wrap",
            }}
          >
            <div
              style={{
                flex:
                  1,

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
                visiblePermissionUuids
                  .length ===
                  0
              }
              onClick={
                toggleAllVisible
              }
            >
              {isAllVisibleSelected ? (
                <>
                  <CheckSquare
                    size={
                      16
                    }
                  />

                  Clear Visible
                </>
              ) : (
                <>
                  <Square
                    size={
                      16
                    }
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

              gap:
                12,

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
                  selectedPermissions
                    .length
                }
              </strong>
            </span>


            <span>
              Total permissions:{" "}
              <strong>
                {
                  allPermissionUuids
                    .length
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

            bottom:
              16,

            zIndex:
              10,

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

              gap:
                12,

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