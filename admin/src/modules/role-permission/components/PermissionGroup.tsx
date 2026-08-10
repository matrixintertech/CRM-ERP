import PermissionItem from "./PermissionItem";

import type {
  Permission,
  PermissionScope,
} from "../types/role-permission.types";

interface Props {
  module: string;

  permissions: Permission[];

  selectedPermissions: string[];

  permissionScopes: Record<
    string,
    PermissionScope
  >;

  onToggle: (
    permissionUuid: string,
  ) => void;

  onScopeChange: (
    permissionUuid: string,
    scope: PermissionScope,
  ) => void;
}

const PermissionGroup = ({
  module,
  permissions,
  selectedPermissions,
  permissionScopes,
  onToggle,
  onScopeChange,
}: Props) => {
  return (
    <div
      style={{
        border:
          "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
      }}
    >
      <h3
        style={{
          marginBottom: 16,
        }}
      >
        {module}
      </h3>

      {permissions.map(
        (permission) => (
          <PermissionItem
            key={
              permission.uuid
            }
            permission={
              permission
            }
            checked={
              selectedPermissions.includes(
                permission.uuid,
              )
            }
            scope={
              permissionScopes[
                permission.uuid
              ] ?? "OWN"
            }
            onToggle={
              onToggle
            }
            onScopeChange={
              onScopeChange
            }
          />
        ),
      )}
    </div>
  );
};

export default PermissionGroup;