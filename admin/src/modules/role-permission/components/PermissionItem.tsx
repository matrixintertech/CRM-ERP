import Select from "@/shared/components/Select";

import type {
  Permission,
  PermissionScope,
} from "../types/role-permission.types";

interface Props {
  permission: Permission;

  checked: boolean;

  scope: PermissionScope;

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

const PermissionItem = ({
  permission,
  checked,
  scope,
  onToggle,
  onScopeChange,
}: Props) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "auto minmax(0, 1fr) 180px",
        alignItems: "center",
        gap: 12,
        padding: "8px 0",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() =>
          onToggle(
            permission.uuid,
          )
        }
      />

      <div
        style={{
          cursor: "pointer",
        }}
        onClick={() =>
          onToggle(
            permission.uuid,
          )
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
            color: "#6b7280",
          }}
        >
          {permission.code}
        </div>
      </div>

      <Select
        value={scope}
        showPlaceholder={false}
        options={scopeOptions}
        disabled={!checked}
        onChange={(event) =>
          onScopeChange(
            permission.uuid,
            event.target
              .value as PermissionScope,
          )
        }
      />
    </div>
  );
};

export default PermissionItem;