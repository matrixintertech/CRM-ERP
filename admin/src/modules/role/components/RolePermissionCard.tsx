import type {
  Permission,
} from "../../permission/types/permission.types";

interface Props {
  permission: Permission;

  checked: boolean;

  disabled?: boolean;

  onToggle: (
    permissionUuid: string,
  ) => void;
}

const RolePermissionCard = ({
  permission,
  checked,
  disabled = false,
  onToggle,
}: Props) => {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 16px",
        cursor: disabled
          ? "not-allowed"
          : "pointer",
        opacity: disabled
          ? 0.6
          : 1,
        borderBottom:
          "1px solid var(--border-color, #f1f5f9)",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={() =>
          onToggle(
            permission.uuid,
          )
        }
        style={{
          marginTop: 3,
        }}
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
            opacity: 0.7,
            marginTop: 2,
          }}
        >
          {permission.code}
        </div>

        {permission.description && (
          <div
            style={{
              fontSize: 12,
              opacity: 0.7,
              marginTop: 4,
            }}
          >
            {
              permission.description
            }
          </div>
        )}
      </div>
    </label>
  );
};

export default RolePermissionCard;