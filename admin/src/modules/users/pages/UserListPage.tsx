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

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import {
  notify,
} from "@/shared/utils/notify";

import {
  useUsers,
} from "../hooks/useUsers";

import {
  useRole,
} from "../../role/hooks/useRoles";

import {
  updateEmployeeUserAccount,
} from "../api/employee-user-account.api";

import {
  getGroupedPermissions,
} from "../../permission/api/permission.api";

import UserTable from "../components/UserTable";
import UserDetailsModal from "../components/UserDetailsModal";

import UserModal, {
  type UserFormData,
} from "../components/UserModal";

import UserPermissionsModal from "../components/UserPermissionsModal";

import type {
  SortOrder,
  User,
  UserPermissionAssignment,
  UserPermissions,
  UserQueryParams,
  UserSortField,
  UserStatus,
  UserType,
} from "../types/user.types";


const initialQuery:
  UserQueryParams = {
  page: 1,

  limit: 10,

  search:
    undefined,

  status:
    undefined,

  userType:
    undefined,

  roleUuid:
    undefined,

  sortBy:
    "createdAt",

  sortOrder:
    "desc",
};


const UserListPage = () => {
  useDocumentTitle(
    "All Users",
  );


  const [
    query,
    setQuery,
  ] =
    useState<UserQueryParams>(
      initialQuery,
    );


  const [
    searchValue,
    setSearchValue,
  ] = useState("");


  const [
    openDetails,
    setOpenDetails,
  ] = useState(false);


  const [
    openEdit,
    setOpenEdit,
  ] = useState(false);


  const [
    openPermissions,
    setOpenPermissions,
  ] = useState(false);


  const [
    selectedUser,
    setSelectedUser,
  ] = useState<
    User | null
  >(null);


  const [
    permissions,
    setPermissions,
  ] = useState<
    UserPermissions | null
  >(null);


  const [
    permissionUserUuid,
    setPermissionUserUuid,
  ] = useState<
    string | null
  >(null);


  const [
    accountUpdating,
    setAccountUpdating,
  ] = useState(false);


  const {
    loading,
    fetching,

    users,
    total,
    page,
    totalPages,

    fetchUser,
    fetchPermissions,
    savePermissions,

    refetch,
  } = useUsers(
    query,
  );


  const {
    roles,
  } = useRole();


  /*
   * Global permission list sirf
   * permission modal open hone par
   * fetch hogi.
   *
   * Har permission ke response me
   * allowedScopes expected hain.
   */
  const groupedPermissionsQuery =
    useQuery({
      queryKey: [
        "grouped-permissions",
        "COMPANY",
      ],

      queryFn: () =>
        getGroupedPermissions(
          "COMPANY",
        ),

      enabled:
        openPermissions,

      staleTime:
        5 * 60 * 1000,
    });


  const roleOptions =
    useMemo(
      () =>
        roles
          .filter(
            (role) =>
              role.status ===
              "ACTIVE",
          )
          .map(
            (role) => ({
              label:
                role.name,

              value:
                role.uuid,
            }),
          ),
      [
        roles,
      ],
    );


  /*
   * Permission groups flatten karo.
   *
   * Permission object me:
   *
   * allowedScopes: PermissionScope[]
   *
   * expected hai.
   */
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


  const handleSearch =
    () => {
      setQuery(
        (previous) => ({
          ...previous,

          page: 1,

          search:
            searchValue.trim() ||
            undefined,
        }),
      );
    };


  const handleResetFilters =
    () => {
      setSearchValue(
        "",
      );

      setQuery({
        ...initialQuery,
      });
    };


  const handleFilterChange =
    (
      field:
        | "status"
        | "userType"
        | "roleUuid",

      value:
        string,
    ) => {
      setQuery(
        (previous) => ({
          ...previous,

          page: 1,

          [field]:
            value ||
            undefined,
        }),
      );
    };


  const handleSortByChange =
    (
      value:
        UserSortField,
    ) => {
      setQuery(
        (previous) => ({
          ...previous,

          page: 1,

          sortBy:
            value,
        }),
      );
    };


  const handleSortOrderChange =
    (
      value:
        SortOrder,
    ) => {
      setQuery(
        (previous) => ({
          ...previous,

          page: 1,

          sortOrder:
            value,
        }),
      );
    };


  const handlePageChange =
    (
      nextPage:
        number,
    ) => {
      if (
        nextPage < 1 ||
        nextPage >
          totalPages
      ) {
        return;
      }

      setQuery(
        (previous) => ({
          ...previous,

          page:
            nextPage,
        }),
      );
    };


  const handleView =
    async (
      uuid:
        string,
    ) => {
      setSelectedUser(
        null,
      );

      setOpenDetails(
        true,
      );

      try {
        const user =
          await fetchUser(
            uuid,
          );

        setSelectedUser(
          user,
        );
      } catch {
        setOpenDetails(
          false,
        );

        setSelectedUser(
          null,
        );
      }
    };


  const handleEdit =
    async (
      uuid:
        string,
    ) => {
      setSelectedUser(
        null,
      );

      try {
        const user =
          await fetchUser(
            uuid,
          );

        setSelectedUser(
          user,
        );

        setOpenEdit(
          true,
        );
      } catch {
        setOpenEdit(
          false,
        );

        setSelectedUser(
          null,
        );
      }
    };


  /*
   * Selected user's role/direct/effective
   * permissions fetch karo.
   *
   * openPermissions true hote hi
   * grouped COMPANY permissions bhi
   * React Query se load ho jayengi.
   */
  const handlePermissions =
    async (
      uuid:
        string,
    ) => {
      setPermissions(
        null,
      );

      setPermissionUserUuid(
        uuid,
      );

      setOpenPermissions(
        true,
      );

      try {
        const userPermissions =
          await fetchPermissions(
            uuid,
          );

        setPermissions(
          userPermissions,
        );
      } catch {
        setOpenPermissions(
          false,
        );

        setPermissionUserUuid(
          null,
        );

        setPermissions(
          null,
        );
      }
    };


  const handleUpdateAccount =
    async (
      formData:
        UserFormData,
    ) => {
      const employeeUuid =
        selectedUser
          ?.employee
          ?.uuid;

      if (!employeeUuid) {
        notify.error(
          "Employee is not linked with this user account.",
        );

        return;
      }

      try {
        setAccountUpdating(
          true,
        );

        await updateEmployeeUserAccount(
          employeeUuid,
          {
            roleUuid:
              formData.roleUuid,

            status:
              formData.status,
          },
        );

        await refetch();

        setOpenEdit(
          false,
        );

        setSelectedUser(
          null,
        );
      } catch (
        error: unknown
      ) {
        const apiError =
          error as {
            response?: {
              data?: {
                message?:
                  string;
              };
            };
          };

        notify.error(
          apiError.response
            ?.data
            ?.message ??
            "Failed to update user account.",
        );
      } finally {
        setAccountUpdating(
          false,
        );
      }
    };


  /*
   * Multi-scope direct user grants.
   *
   * Same permission multiple scopes
   * ke saath aa sakti hai:
   *
   * [
   *   {
   *     permissionUuid: "...",
   *     scope: "ORGANIZATION_UNIT"
   *   },
   *   {
   *     permissionUuid: "...",
   *     scope: "COMPANY"
   *   }
   * ]
   */
  const handleSavePermissions =
    async (
      selectedPermissions:
        UserPermissionAssignment[],
    ) => {
      if (
        !permissionUserUuid
      ) {
        notify.error(
          "User is not selected.",
        );

        return;
      }

      try {
        const updatedPermissions =
          await savePermissions(
            permissionUserUuid,
            {
              permissions:
                selectedPermissions,
            },
          );

        setPermissions(
          updatedPermissions,
        );

        notify.success(
          "User permissions updated successfully.",
        );

        setOpenPermissions(
          false,
        );

        setPermissionUserUuid(
          null,
        );

        setPermissions(
          null,
        );
      } catch (
        error: unknown
      ) {
        const apiError =
          error as {
            response?: {
              data?: {
                message?:
                  string;
              };
            };
          };

        notify.error(
          apiError.response
            ?.data
            ?.message ??
            "Failed to save user permissions.",
        );
      }
    };


  const handleClosePermissions =
    () => {
      setOpenPermissions(
        false,
      );

      setPermissionUserUuid(
        null,
      );

      setPermissions(
        null,
      );
    };


  const pageLoading =
    loading;


  const backgroundFetching =
    fetching &&
    !loading;


  const permissionModalLoading =
    openPermissions &&
    (
      !permissions ||
      groupedPermissionsQuery
        .isLoading ||
      groupedPermissionsQuery
        .isFetching
    );


  return (
    <>
      <PageHeader
        title="Users"
        subtitle="Manage login users, roles and additional permissions"
      />


      <Card>
        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "minmax(220px, 1.4fr) repeat(5, minmax(140px, 1fr)) auto auto",

            alignItems:
              "end",

            gap: 12,

            marginBottom:
              24,
          }}
        >
          <Input
            label="Search"
            placeholder="Name, email, mobile or employee code"
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
              query.status ??
              ""
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

              {
                label:
                  "Pending",

                value:
                  "PENDING",
              },

              {
                label:
                  "Suspended",

                value:
                  "SUSPENDED",
              },
            ]}
            onChange={(
              event,
            ) =>
              handleFilterChange(
                "status",

                event.target
                  .value as
                  | UserStatus
                  | "",
              )
            }
          />


          <Select
            label="User Type"
            value={
              query.userType ??
              ""
            }
            options={[
              {
                label:
                  "All User Types",

                value:
                  "",
              },

              {
                label:
                  "Platform Owner",

                value:
                  "PLATFORM_OWNER",
              },

              {
                label:
                  "Company Admin",

                value:
                  "COMPANY_ADMIN",
              },

              {
                label:
                  "Employee",

                value:
                  "EMPLOYEE",
              },

              {
                label:
                  "Client",

                value:
                  "CLIENT",
              },

              {
                label:
                  "Vendor",

                value:
                  "VENDOR",
              },
            ]}
            onChange={(
              event,
            ) =>
              handleFilterChange(
                "userType",

                event.target
                  .value as
                  | UserType
                  | "",
              )
            }
          />


          <Select
            label="Role"
            value={
              query.roleUuid ??
              ""
            }
            options={[
              {
                label:
                  "All Roles",

                value:
                  "",
              },

              ...roleOptions,
            ]}
            onChange={(
              event,
            ) =>
              handleFilterChange(
                "roleUuid",

                event.target
                  .value,
              )
            }
          />


          <Select
            label="Sort By"
            value={
              query.sortBy ??
              "createdAt"
            }
            options={[
              {
                label:
                  "Created Date",

                value:
                  "createdAt",
              },

              {
                label:
                  "Name",

                value:
                  "name",
              },

              {
                label:
                  "Email",

                value:
                  "email",
              },

              {
                label:
                  "Status",

                value:
                  "status",
              },

              {
                label:
                  "User Type",

                value:
                  "userType",
              },
            ]}
            onChange={(
              event,
            ) =>
              handleSortByChange(
                event.target
                  .value as
                  UserSortField,
              )
            }
          />


          <Select
            label="Order"
            value={
              query.sortOrder ??
              "desc"
            }
            options={[
              {
                label:
                  "Descending",

                value:
                  "desc",
              },

              {
                label:
                  "Ascending",

                value:
                  "asc",
              },
            ]}
            onChange={(
              event,
            ) =>
              handleSortOrderChange(
                event.target
                  .value as
                  SortOrder,
              )
            }
          />


          <Button
            type="button"
            loading={
              pageLoading
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
              pageLoading
            }
            onClick={
              handleResetFilters
            }
          >
            Reset
          </Button>
        </div>


        {backgroundFetching && (
          <div
            style={{
              marginBottom:
                10,

              fontSize:
                12,

              color:
                "#6b7280",
            }}
          >
            Updating users...
          </div>
        )}


        <UserTable
          data={
            users
          }
          loading={
            pageLoading
          }
          onView={
            handleView
          }
          onEdit={
            handleEdit
          }
          onPermissions={
            handlePermissions
          }
        />


        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap: 16,

            marginTop:
              20,
          }}
        >
          <div
            style={{
              color:
                "#6b7280",

              fontSize:
                14,
            }}
          >
            Showing{" "}
            {users.length}{" "}
            of{" "}
            {total}{" "}
            users
          </div>


          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap: 10,
            }}
          >
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={
                pageLoading ||
                page <= 1
              }
              onClick={() =>
                handlePageChange(
                  page - 1,
                )
              }
            >
              Previous
            </Button>


            <span
              style={{
                fontSize:
                  14,

                color:
                  "#374151",
              }}
            >
              Page{" "}
              {page}{" "}
              of{" "}
              {totalPages ||
                1}
            </span>


            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={
                pageLoading ||
                page >=
                  totalPages
              }
              onClick={() =>
                handlePageChange(
                  page + 1,
                )
              }
            >
              Next
            </Button>
          </div>
        </div>
      </Card>


      <UserDetailsModal
        open={
          openDetails
        }
        loading={
          openDetails &&
          !selectedUser
        }
        user={
          selectedUser
        }
        onClose={() => {
          setOpenDetails(
            false,
          );

          setSelectedUser(
            null,
          );
        }}
      />


      <UserModal
        open={
          openEdit
        }
        loading={
          accountUpdating
        }
        user={
          selectedUser
        }
        roleOptions={
          roleOptions
        }
        onClose={() => {
          setOpenEdit(
            false,
          );

          setSelectedUser(
            null,
          );
        }}
        onSubmit={
          handleUpdateAccount
        }
      />


      <UserPermissionsModal
        open={
          openPermissions
        }
        loading={
          permissionModalLoading
        }
        permissions={
          permissions
        }
        allPermissions={
          allPermissions
        }
        onClose={
          handleClosePermissions
        }
        onSubmit={
          handleSavePermissions
        }
      />
    </>
  );
};


export default UserListPage;