import PermissionItem from "./PermissionItem";

import type {
  Permission,
} from "../types/role-permission.types";

interface Props {
  module: string;

  permissions: Permission[];

  selectedPermissions: string[];

  onToggle: (
    permissionId: string,
  ) => void;
}

const PermissionGroup = ({
  module,
  permissions,
  selectedPermissions,
  onToggle,
}: Props) => {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
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
            key={permission.id}
            permission={
              permission
            }
            checked={selectedPermissions.includes(
              permission.id,
            )}
            onToggle={
              onToggle
            }
          />
        ),
      )}
    </div>
  );
};

export default PermissionGroup;