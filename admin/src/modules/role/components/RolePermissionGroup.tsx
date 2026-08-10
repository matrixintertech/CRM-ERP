import Button from "@/shared/components/Button";

import RolePermissionCard from "./RolePermissionCard";

import type {
  PermissionGroup,
} from "../../permission/types/permission.types";

import type {
  PermissionScope,
  RolePermissionScopeMap,
} from "../../role-permission/types/role-permission.types";

interface Props {
  group: PermissionGroup;

  selectedPermissionUuids:
    string[];

  permissionScopes:
    RolePermissionScopeMap;

  disabled?: boolean;

  onTogglePermission: (
    permissionUuid: string,
  ) => void;

  onScopeChange: (
    permissionUuid: string,
    scope: PermissionScope,
  ) => void;

  onToggleGroup: (
    group: PermissionGroup,
  ) => void;
}

const formatModuleName = (
  module: string,
) =>
  module
    .replaceAll(
      "_",
      " ",
    )
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );

const RolePermissionGroup = ({
  group,
  selectedPermissionUuids,
  permissionScopes,
  disabled = false,
  onTogglePermission,
  onScopeChange,
  onToggleGroup,
}: Props) => {
  const groupPermissionUuids =
    group.permissions.map(
      (
        permission,
      ) =>
        permission.uuid,
    );

  const selectedCount =
    groupPermissionUuids.filter(
      (
        permissionUuid,
      ) =>
        selectedPermissionUuids.includes(
          permissionUuid,
        ),
    ).length;

  const allGroupSelected =
    groupPermissionUuids.length >
      0 &&
    selectedCount ===
      groupPermissionUuids.length;

  return (
    <div
      style={{
        border:
          "1px solid var(--border-color, #e5e7eb)",
        borderRadius: 10,
        overflow:
          "hidden",
      }}
    >
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

          padding:
            "14px 16px",

          background:
            "var(--surface-muted, #f8fafc)",

          borderBottom:
            "1px solid var(--border-color, #e5e7eb)",
        }}
      >
        <div>
          <div
            style={{
              fontWeight:
                600,
            }}
          >
            {formatModuleName(
              group.module,
            )}
          </div>

          <div
            style={{
              fontSize:
                12,

              marginTop:
                3,

              opacity:
                0.7,
            }}
          >
            {selectedCount}/
            {group.permissions.length}{" "}
            selected
          </div>
        </div>

        <Button
          size="sm"
          variant="secondary"
          disabled={
            disabled ||
            group.permissions.length ===
              0
          }
          onClick={() =>
            onToggleGroup(
              group,
            )
          }
        >
          {allGroupSelected
            ? "Clear"
            : "Select All"}
        </Button>
      </div>

      <div
        style={{
          display:
            "flex",

          flexDirection:
            "column",
        }}
      >
        {group.permissions.map(
          (
            permission,
          ) => {
            const checked =
              selectedPermissionUuids.includes(
                permission.uuid,
              );

            const scope =
              permissionScopes[
                permission.uuid
              ] ??
              "OWN";

            return (
              <RolePermissionCard
                key={
                  permission.uuid
                }
                permission={
                  permission
                }
                checked={
                  checked
                }
                scope={
                  scope
                }
                disabled={
                  disabled
                }
                onToggle={
                  onTogglePermission
                }
                onScopeChange={
                  onScopeChange
                }
              />
            );
          },
        )}
      </div>
    </div>
  );
};

export default RolePermissionGroup;