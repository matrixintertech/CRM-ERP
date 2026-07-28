import type {
  Permission,
} from "../types/role-permission.types";

interface Props {
  permission: Permission;

  checked: boolean;

  onToggle: (
    permissionId: string,
  ) => void;
}

const PermissionItem = ({
  permission,
  checked,
  onToggle,
}: Props) => {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 0",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() =>
          onToggle(permission.id)
        }
      />

      <div>
        <div
          style={{
            fontWeight: 500,
          }}
        >
          {permission.name}
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#6b7280",
          }}
        >
          {permission.code}
        </div>
      </div>
    </label>
  );
};

export default PermissionItem;