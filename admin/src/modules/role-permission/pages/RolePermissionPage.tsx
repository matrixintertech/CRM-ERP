import {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Card from "@/shared/components/Card";
import PageHeader from "@/shared/components/PageHeader";

import PermissionFooter from "../components/PermissionFooter";
import PermissionGroup from "../components/PermissionGroup";
import PermissionToolbar from "../components/PermissionToolbar";

import { useRolePermissions } from "../hooks/useRolePermissions";

const RolePermissionPage = () => {
  const navigate = useNavigate();

  const { roleId } = useParams();

  const [search, setSearch] =
    useState("");

  const {
    loading,

    groupedPermissions,

    selectedPermissions,

    fetchPermissions,

    togglePermission,

    savePermissions,
  } = useRolePermissions();

  useEffect(() => {
    if (roleId) {
      fetchPermissions(roleId);
    }
  }, [roleId]);

  const filteredGroups =
    groupedPermissions
      .map((group) => ({
        ...group,
        permissions:
          group.permissions.filter(
            (permission) =>
              permission.name
                .toLowerCase()
                .includes(
                  search.toLowerCase(),
                ) ||
              permission.code
                .toLowerCase()
                .includes(
                  search.toLowerCase(),
                ),
          ),
      }))
      .filter(
        (group) =>
          group.permissions.length >
          0,
      );

  return (
    <>
      <PageHeader
        title="Role Permissions"
        subtitle="Assign permissions to role"
      />

      <PermissionToolbar
        roleName="Role Permissions"
        search={search}
        onSearchChange={
          setSearch
        }
        onBack={() =>
          navigate(-1)
        }
      />

      <Card>
        {filteredGroups.length ===
        0 ? (
          <p>
            No permissions found.
          </p>
        ) : (
          filteredGroups.map(
            (group) => (
              <PermissionGroup
                key={group.module}
                module={
                  group.module
                }
                permissions={
                  group.permissions
                }
                selectedPermissions={
                  selectedPermissions
                }
                onToggle={
                  togglePermission
                }
              />
            ),
          )
        )}

        <PermissionFooter
          loading={loading}
          selectedCount={
            selectedPermissions.length
          }
          onReset={() => {
            if (roleId) {
              fetchPermissions(
                roleId,
              );
            }
          }}
          onSave={() => {
            if (roleId) {
              savePermissions(
                roleId,
              );
            }
          }}
        />
      </Card>
    </>
  );
};

export default RolePermissionPage;