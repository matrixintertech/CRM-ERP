import { useEffect, useMemo, useState } from "react";

import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import { notify } from "@/shared/utils/notify";

import { useUsers } from "../hooks/useUsers";

import { useRole } from "../../role/hooks/useRoles";

import { updateEmployeeUserAccount } from "../api/employee-user-account.api";

import UserTable from "../components/UserTable";
import UserDetailsModal from "../components/UserDetailsModal";

import UserModal, { type UserFormData } from "../components/UserModal";

import UserPermissionsModal from "../components/UserPermissionsModal";

import type {
  Permission,
  UserQueryParams,
  UserStatus,
  UserType,
} from "../types/user.types";

import { getPermissions } from "../../permission/api/permission.api";

const initialQuery: UserQueryParams = {
  page: 1,
  limit: 10,
  search: "",
  status: undefined,
  userType: undefined,
  roleUuid: undefined,
};

const UserListPage = () => {
  useDocumentTitle("All Users");
  const {
    loading,

    users,
    total,
    page,
    totalPages,

    selectedUser,
    permissions,

    fetchUsers,
    fetchUser,
    fetchPermissions,
    savePermissions,

    clearSelectedUser,
    clearPermissions,
  } = useUsers();

  const { roles, fetchRoles } = useRole();

  const [query, setQuery] = useState<UserQueryParams>(initialQuery);

  const [searchValue, setSearchValue] = useState("");

  const [openDetails, setOpenDetails] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);

  const [openPermissions, setOpenPermissions] = useState(false);

  const [permissionUserUuid, setPermissionUserUuid] = useState<string | null>(
    null,
  );

  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);

  const [accountUpdating, setAccountUpdating] = useState(false);

  useEffect(() => {
    void Promise.all([fetchUsers(initialQuery), fetchRoles()]);
  }, [fetchUsers, fetchRoles]);

  const roleOptions = useMemo(
    () =>
      roles
        .filter((role) => role.status === "ACTIVE")
        .map((role) => ({
          label: role.name,

          value: role.uuid,
        })),
    [roles],
  );

  const handleSearch = async () => {
    const nextQuery: UserQueryParams = {
      ...query,

      page: 1,

      search: searchValue.trim() || undefined,
    };

    setQuery(nextQuery);

    await fetchUsers(nextQuery);
  };

  const handleResetFilters = async () => {
    setSearchValue("");

    setQuery(initialQuery);

    await fetchUsers(initialQuery);
  };

  const handleFilterChange = async (
    field: "status" | "userType" | "roleUuid",

    value: string,
  ) => {
    const nextQuery: UserQueryParams = {
      ...query,

      page: 1,

      [field]: value || undefined,
    };

    setQuery(nextQuery);

    await fetchUsers(nextQuery);
  };

  const handlePageChange = async (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }

    const nextQuery: UserQueryParams = {
      ...query,

      page: nextPage,
    };

    setQuery(nextQuery);

    await fetchUsers(nextQuery);
  };

  const handleView = async (uuid: string) => {
    clearSelectedUser();

    setOpenDetails(true);

    try {
      await fetchUser(uuid);
    } catch {
      setOpenDetails(false);
    }
  };

  const handleEdit = async (uuid: string) => {
    clearSelectedUser();

    try {
      await Promise.all([fetchUser(uuid), fetchRoles()]);

      setOpenEdit(true);
    } catch {
      setOpenEdit(false);
    }
  };

  const handlePermissions = async (uuid: string) => {
    clearPermissions();

    setPermissionUserUuid(uuid);

    setOpenPermissions(true);

    try {
      const [, globalPermissions] = await Promise.all([
        fetchPermissions(uuid),

        getPermissions(),
      ]);

      setAllPermissions(globalPermissions);
    } catch {
      setOpenPermissions(false);

      setPermissionUserUuid(null);

      setAllPermissions([]);
    }
  };

  const handleUpdateAccount = async (formData: UserFormData) => {
    const employeeUuid = selectedUser?.employee?.uuid;

    if (!employeeUuid) {
      notify.error("Employee is not linked with this user account.");

      return;
    }

    try {
      setAccountUpdating(true);

      await updateEmployeeUserAccount(employeeUuid, {
        roleUuid: formData.roleUuid,

        status: formData.status,
      });

      notify.success("User account updated successfully.");

      await fetchUsers(query);

      setOpenEdit(false);

      clearSelectedUser();
    } catch (error: unknown) {
      const apiError = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      notify.error(
        apiError.response?.data?.message ?? "Failed to update user account.",
      );
    } finally {
      setAccountUpdating(false);
    }
  };

  const handleSavePermissions = async (permissionUuids: string[]) => {
    if (!permissionUserUuid) {
      notify.error("User is not selected.");

      return;
    }

    await savePermissions(permissionUserUuid, {
      permissionUuids,
    });

    setOpenPermissions(false);

    setPermissionUserUuid(null);

    setAllPermissions([]);

    clearPermissions();
  };

  return (
    <>
      <PageHeader
        title="Users"
        subtitle="Manage login users, roles and additional permissions"
      />

      <Card>
        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "minmax(220px, 1fr) repeat(3, minmax(160px, 220px)) auto auto",

            alignItems: "end",

            gap: 12,

            marginBottom: 24,
          }}
        >
          <Input
            label="Search"
            placeholder="Name, email, mobile or employee code"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void handleSearch();
              }
            }}
          />

          <Select
            label="Status"
            value={query.status ?? ""}
            options={[
              {
                label: "All Statuses",
                value: "",
              },
              {
                label: "Active",
                value: "ACTIVE",
              },
              {
                label: "Inactive",
                value: "INACTIVE",
              },
              {
                label: "Pending",
                value: "PENDING",
              },
              {
                label: "Suspended",
                value: "SUSPENDED",
              },
            ]}
            onChange={(event) =>
              void handleFilterChange(
                "status",

                event.target.value as UserStatus | "",
              )
            }
          />

          <Select
            label="User Type"
            value={query.userType ?? ""}
            options={[
              {
                label: "All User Types",
                value: "",
              },
              {
                label: "Platform Owner",
                value: "PLATFORM_OWNER",
              },
              {
                label: "Company Admin",
                value: "COMPANY_ADMIN",
              },
              {
                label: "Employee",
                value: "EMPLOYEE",
              },
              {
                label: "Client",
                value: "CLIENT",
              },
              {
                label: "Vendor",
                value: "VENDOR",
              },
            ]}
            onChange={(event) =>
              void handleFilterChange(
                "userType",

                event.target.value as UserType | "",
              )
            }
          />

          <Select
            label="Role"
            value={query.roleUuid ?? ""}
            options={[
              {
                label: "All Roles",
                value: "",
              },

              ...roleOptions,
            ]}
            onChange={(event) =>
              void handleFilterChange(
                "roleUuid",

                event.target.value,
              )
            }
          />

          <Button type="button" loading={loading} onClick={handleSearch}>
            Search
          </Button>

          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={handleResetFilters}
          >
            Reset
          </Button>
        </div>

        <UserTable
          data={users}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onPermissions={handlePermissions}
        />

        <div
          style={{
            display: "flex",

            alignItems: "center",

            justifyContent: "space-between",

            gap: 16,

            marginTop: 20,
          }}
        >
          <div
            style={{
              color: "#6b7280",

              fontSize: 14,
            }}
          >
            Showing {users.length} of {total} users
          </div>

          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: 10,
            }}
          >
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={loading || page <= 1}
              onClick={() => void handlePageChange(page - 1)}
            >
              Previous
            </Button>

            <span
              style={{
                fontSize: 14,

                color: "#374151",
              }}
            >
              Page {page} of {totalPages || 1}
            </span>

            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={loading || page >= totalPages}
              onClick={() => void handlePageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      <UserDetailsModal
        open={openDetails}
        loading={loading}
        user={selectedUser}
        onClose={() => {
          setOpenDetails(false);

          clearSelectedUser();
        }}
      />

      <UserModal
        open={openEdit}
        loading={accountUpdating}
        user={selectedUser}
        roleOptions={roleOptions}
        onClose={() => {
          setOpenEdit(false);

          clearSelectedUser();
        }}
        onSubmit={handleUpdateAccount}
      />

      <UserPermissionsModal
        open={openPermissions}
        loading={loading}
        permissions={permissions}
        allPermissions={allPermissions}
        onClose={() => {
          setOpenPermissions(false);

          setPermissionUserUuid(null);

          setAllPermissions([]);

          clearPermissions();
        }}
        onSubmit={handleSavePermissions}
      />
    </>
  );
};

export default UserListPage;
