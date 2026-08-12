import Select from "@/shared/components/Select";

import type {
  Permission,
  PermissionScope,
} from "../../permission/types/permission.types";

interface Props {
  permission: Permission;

  checked: boolean;

  scope:
    PermissionScope | null;

  disabled?: boolean;

  onToggle: (
    permissionUuid: string,
  ) => void;

  onScopeChange: (
    permissionUuid: string,
    scope: PermissionScope,
  ) => void;
}

const scopeLabels:
  Record<
    PermissionScope,
    string
  > = {
    OWN: "Own",

    TEAM: "Team",

    ORGANIZATION_UNIT:
      "Organization Unit",

    PROJECT: "Project",

    COMPANY: "Company",
  };

const RolePermissionCard = ({
  permission,
  checked,
  scope,
  disabled = false,
  onToggle,
  onScopeChange,
}: Props) => {
  const allowedScopes =
    permission.allowedScopes ??
    [];

  /*
   * Sirf permission ke supported
   * scopes dropdown me show honge.
   */
  const scopeOptions =
    allowedScopes.map(
      (
        allowedScope,
      ) => ({
        label:
          scopeLabels[
            allowedScope
          ],

        value:
          allowedScope,
      }),
    );

  const hasAllowedScopes =
    allowedScopes.length >
    0;

  const isDisabled =
    disabled ||
    !hasAllowedScopes;

  const handleToggle =
    () => {
      if (isDisabled) {
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
      isDisabled ||
      !checked
    ) {
      return;
    }

    const selectedScope =
      value as PermissionScope;

    /*
     * Frontend safety:
     * selected value permission ke
     * allowedScopes me hona chahiye.
     */
    if (
      !allowedScopes.includes(
        selectedScope,
      )
    ) {
      return;
    }

    onScopeChange(
      permission.uuid,
      selectedScope,
    );
  };

  return (
    <div
      style={{
        display:
          "grid",

        gridTemplateColumns:
          "auto minmax(0, 1fr) 180px",

        alignItems:
          "center",

        gap:
          12,

        padding:
          "12px 16px",

        opacity:
          isDisabled
            ? 0.6
            : 1,

        borderBottom:
          "1px solid var(--border-color, #f1f5f9)",
      }}
    >
      <input
        type="checkbox"
        checked={
          checked
        }
        disabled={
          isDisabled
        }
        onChange={
          handleToggle
        }
      />

      <div
        style={{
          minWidth:
            0,

          cursor:
            isDisabled
              ? "not-allowed"
              : "pointer",
        }}
        onClick={
          handleToggle
        }
      >
        <div
          style={{
            fontWeight:
              500,
          }}
        >
          {
            permission.name
          }
        </div>

        <div
          style={{
            fontSize:
              12,

            opacity:
              0.7,

            marginTop:
              2,
          }}
        >
          {
            permission.code
          }
        </div>

        {permission.description && (
          <div
            style={{
              fontSize:
                12,

              opacity:
                0.7,

              marginTop:
                4,
            }}
          >
            {
              permission.description
            }
          </div>
        )}

        {!hasAllowedScopes && (
          <div
            style={{
              fontSize:
                12,

              marginTop:
                4,
            }}
          >
            No scopes configured
          </div>
        )}
      </div>

      <Select
        value={
          scope ??
          ""
        }
        showPlaceholder={
          false
        }
        options={
          scopeOptions
        }
        disabled={
          !checked ||
          isDisabled
        }
        onChange={(
          event,
        ) =>
          handleScopeChange(
            event.target
              .value,
          )
        }
      />
    </div>
  );
};

export default RolePermissionCard;