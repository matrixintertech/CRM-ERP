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


/*
 * =========================================================
 * COMPANY ADMIN REQUIRED PERMISSIONS
 * =========================================================
 *
 * IMPORTANT:
 *
 * Ye frontend UX lock hai.
 *
 * Backend RoleService is list ka actual security
 * enforcement already company-admin-template.ts
 * ke through karta hai.
 *
 * Frontend bypass hone par bhi backend required
 * permission removal reject karega.
 */
const COMPANY_ADMIN_REQUIRED_PERMISSION_CODES =
  new Set<string>([
    "company.employee.view",
    "company.employee.update",

    "company.permission.view",

    "company.role.view",
    "company.role.update",

    "company.user.view",
    "company.user.update",
  ]);


const COMPANY_ADMIN_ROLE_CODE =
  "COMPANY_ADMIN";


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
   * Dedicated COMPANY permission catalog.
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
   * =========================================================
   * LOAD CURRENT ROLE PERMISSIONS
   * =========================================================
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


  const role =
    rolePermissionData
      ?.role;


  /*
   * COMPANY_ADMIN code reserved backend side hai.
   *
   * Isliye code check UX identification ke liye
   * safe hai. Authorization bypass ke liye nahi.
   */
  const isCompanyAdminRole =
    role?.code ===
    COMPANY_ADMIN_ROLE_CODE;


  /*
   * =========================================================
   * PERMISSION LOOKUP
   * =========================================================
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
   * =========================================================
   * LOCKED / REQUIRED PERMISSION UUIDS
   * =========================================================
   *
   * Normal role:
   * []
   *
   * COMPANY_ADMIN:
   * required codes -> catalog UUIDs
   */
  const lockedPermissionUuids =
    useMemo(() => {
      if (
        !isCompanyAdminRole
      ) {
        return [];
      }


      return groupedPermissions
        .flatMap(
          (
            group,
          ) =>
            group.permissions,
        )
        .filter(
          (
            permission,
          ) =>
            COMPANY_ADMIN_REQUIRED_PERMISSION_CODES.has(
              permission.code,
            ),
        )
        .map(
          (
            permission,
          ) =>
            permission.uuid,
        );
    }, [
      groupedPermissions,
      isCompanyAdminRole,
    ]);


  const lockedPermissionUuidSet =
    useMemo(
      () =>
        new Set(
          lockedPermissionUuids,
        ),
      [
        lockedPermissionUuids,
      ],
    );


  const isPermissionLocked = (
    permissionUuid: string,
  ) =>
    lockedPermissionUuidSet.has(
      permissionUuid,
    );


  /*
   * =========================================================
   * SELECTED PERMISSIONS
   * =========================================================
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
   * =========================================================
   * SEARCH
   * =========================================================
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
   * =========================================================
   * DEFAULT SCOPE
   * =========================================================
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
   * =========================================================
   * COUNTS
   * =========================================================
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
   * Permissions currently visible and assignable.
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


  /*
   * Visible permissions which are actually editable.
   *
   * Required Company Admin permissions excluded.
   */
  const editableVisiblePermissionUuids =
    useMemo(
      () =>
        visiblePermissionUuids.filter(
          (
            permissionUuid,
          ) =>
            !lockedPermissionUuidSet.has(
              permissionUuid,
            ),
        ),
      [
        visiblePermissionUuids,
        lockedPermissionUuidSet,
      ],
    );


  /*
   * Button state based on editable permissions.
   *
   * Locked grants do not affect Clear Optional state.
   */
  const isAllVisibleSelected =
    editableVisiblePermissionUuids.length >
      0 &&
    editableVisiblePermissionUuids.every(
      (
        permissionUuid,
      ) =>
        selectedPermissionUuids.includes(
          permissionUuid,
        ),
    );


  /*
   * =========================================================
   * CHANGE DETECTION
   * =========================================================
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
   * =========================================================
   * SINGLE PERMISSION TOGGLE
   * =========================================================
   */
  const togglePermission = (
    permissionUuid: string,
  ) => {
    /*
     * Required Company Admin permission
     * cannot be manually toggled.
     */
    if (
      isPermissionLocked(
        permissionUuid,
      )
    ) {
      return;
    }


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
   * =========================================================
   * SCOPE CHANGE
   * =========================================================
   */
  const handleScopeChange = (
    permissionUuid: string,
    scope: PermissionScope,
  ) => {
    /*
     * Required Company Admin permission
     * scope is immutable.
     */
    if (
      isPermissionLocked(
        permissionUuid,
      )
    ) {
      return;
    }


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
   * =========================================================
   * GROUP TOGGLE
   * =========================================================
   */
  const toggleGroup = (
    group:
      PermissionGroup,
  ) => {
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


    /*
     * Required permissions group clear/select
     * operation se excluded hain.
     */
    const editablePermissions =
      selectablePermissions.filter(
        (
          permission,
        ) =>
          !isPermissionLocked(
            permission.uuid,
          ),
      );


    const editablePermissionUuids =
      editablePermissions.map(
        (
          permission,
        ) =>
          permission.uuid,
      );


    if (
      editablePermissionUuids.length ===
      0
    ) {
      return;
    }


    const allEditableSelected =
      editablePermissionUuids.every(
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
        /*
         * Clear optional permissions only.
         *
         * Locked permissions remain untouched.
         */
        if (
          allEditableSelected
        ) {
          return previous.filter(
            (
              permission,
            ) =>
              !editablePermissionUuids.includes(
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
          of editablePermissions
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
   * =========================================================
   * SELECT / CLEAR VISIBLE
   * =========================================================
   */
  const toggleAllVisible =
    () => {
      if (
        editableVisiblePermissionUuids
          .length ===
        0
      ) {
        return;
      }


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


          const allEditableVisibleSelected =
            editableVisiblePermissionUuids
              .every(
                (
                  permissionUuid,
                ) =>
                  selectedUuids.has(
                    permissionUuid,
                  ),
              );


          /*
           * Clear visible OPTIONAL grants.
           *
           * Required permissions stay selected.
           */
          if (
            allEditableVisibleSelected
          ) {
            return previous.filter(
              (
                permission,
              ) =>
                !editableVisiblePermissionUuids
                  .includes(
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
            /*
             * Required permissions are not
             * modified by bulk actions.
             */
            if (
              isPermissionLocked(
                permission.uuid,
              )
            ) {
              continue;
            }


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
   * =========================================================
   * SAVE
   * =========================================================
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
   * =========================================================
   * RESET
   * =========================================================
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
          {isCompanyAdminRole && (
            <div
              style={{
                padding:
                  "12px 14px",

                border:
                  "1px solid var(--border-color, #e5e7eb)",

                borderRadius:
                  8,

                background:
                  "var(--surface-muted, #f8fafc)",

                fontSize:
                  13,

                lineHeight:
                  1.5,
              }}
            >
              <strong>
                Company Admin system role
              </strong>

              {" — "}

              permissions marked as{" "}
              <strong>
                Required
              </strong>{" "}
              are protected from removal
              and scope changes.
            </div>
          )}


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
                editableVisiblePermissionUuids
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

                  {isCompanyAdminRole
                    ? "Clear Optional"
                    : "Clear Visible"}
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


            {isCompanyAdminRole && (
              <span>
                Required permissions:{" "}
                <strong>
                  {
                    lockedPermissionUuids
                      .length
                  }
                </strong>
              </span>
            )}


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

                    lockedPermissionUuids={
                      lockedPermissionUuids
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