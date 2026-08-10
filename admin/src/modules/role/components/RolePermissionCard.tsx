import Select from "@/shared/components/Select";

import type {
  Permission,
} from "../../permission/types/permission.types";

import type {
  PermissionScope,
} from "../../role-permission/types/role-permission.types";

interface Props {
  permission: Permission;

  checked: boolean;

  scope: PermissionScope;

  disabled?: boolean;

  onToggle: (
    permissionUuid: string,
  ) => void;

  onScopeChange: (
    permissionUuid: string,
    scope: PermissionScope,
  ) => void;
}

const scopeOptions = [
  {
    label: "Own",
    value: "OWN",
  },
  {
    label: "Team",
    value: "TEAM",
  },
  {
    label: "Organization Unit",
    value: "ORGANIZATION_UNIT",
  },
  {
    label: "Project",
    value: "PROJECT",
  },
  {
    label: "Company",
    value: "COMPANY",
  },
];

const RolePermissionCard = ({
  permission,
  checked,
  scope,
  disabled = false,
  onToggle,
  onScopeChange,
}: Props) => {
  const handleToggle = () => {
    if (disabled) {
      return;
    }

    onToggle(
      permission.uuid,
    );
  };

  const handleScopeChange = (
    value: string,
  ) => {
    if (
      disabled ||
      !checked
    ) {
      return;
    }

    onScopeChange(
      permission.uuid,
      value as PermissionScope,
    );
  };

  return (
    <div
      style={{
        display: "grid",

        gridTemplateColumns:
          "auto minmax(0, 1fr) 180px",

        alignItems:
          "center",

        gap: 12,

        padding:
          "12px 16px",

        opacity:
          disabled
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
        onChange={
          handleToggle
        }
      />

      <div
        style={{
          minWidth: 0,

          cursor:
            disabled
              ? "not-allowed"
              : "pointer",
        }}
        onClick={
          handleToggle
        }
      >
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

      <Select
        value={
          scope
        }
        showPlaceholder={
          false
        }
        options={
          scopeOptions
        }
        disabled={
          !checked ||
          disabled
        }
        onChange={(
          event,
        ) =>
          handleScopeChange(
            event.target.value,
          )
        }
      />
    </div>
  );
};

export default RolePermissionCard;