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

  /*
   * COMPANY_ADMIN ke required
   * permission UUIDs.
   */
  lockedPermissionUuids:
    string[];

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
  lockedPermissionUuids,
  disabled = false,
  onTogglePermission,
  onScopeChange,
  onToggleGroup,
}: Props) => {
  /*
   * Sirf wahi permissions group-level
   * selection me participate karengi
   * jinke allowedScopes configured hain.
   */
  const selectablePermissions =
    group.permissions.filter(
      (permission) =>
        (
          permission.allowedScopes
            ?.length ??
          0
        ) > 0,
    );


  const selectablePermissionUuids =
    selectablePermissions.map(
      (permission) =>
        permission.uuid,
    );


  const selectedCount =
    selectablePermissionUuids.filter(
      (permissionUuid) =>
        selectedPermissionUuids.includes(
          permissionUuid,
        ),
    ).length;


  const allGroupSelected =
    selectablePermissionUuids.length >
      0 &&
    selectedCount ===
      selectablePermissionUuids.length;


  /*
   * Group ke andar kitni required /
   * locked permissions hain.
   */
  const lockedCount =
    selectablePermissionUuids.filter(
      (permissionUuid) =>
        lockedPermissionUuids.includes(
          permissionUuid,
        ),
    ).length;


  /*
   * Agar group me sirf locked permissions
   * hain to group clear/select button ka
   * koi useful action nahi hai.
   */
  const hasEditablePermissions =
    selectablePermissionUuids.some(
      (permissionUuid) =>
        !lockedPermissionUuids.includes(
          permissionUuid,
        ),
    );


  return (
    <div
      style={{
        border:
          "1px solid var(--border-color, #e5e7eb)",

        borderRadius:
          10,

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
            {
              selectablePermissions.length
            }{" "}
            selected

            {lockedCount > 0 && (
              <>
                {" "}
                ·{" "}
                {lockedCount} required
              </>
            )}
          </div>
        </div>


        <Button
          size="sm"
          variant="secondary"
          disabled={
            disabled ||
            selectablePermissions.length ===
              0 ||
            !hasEditablePermissions
          }
          onClick={() =>
            onToggleGroup(
              group,
            )
          }
        >
          {allGroupSelected
            ? "Clear Optional"
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


            const allowedScopes =
              permission.allowedScopes ??
              [];


            const scope =
              permissionScopes[
                permission.uuid
              ] ??
              allowedScopes[0] ??
              null;


            const hasAllowedScopes =
              allowedScopes.length >
              0;


            /*
             * Required Company Admin permission.
             */
            const locked =
              lockedPermissionUuids.includes(
                permission.uuid,
              );


            return (
              <div
                key={
                  permission.uuid
                }
                style={{
                  position:
                    "relative",
                }}
              >
                {locked && (
                  <div
                    style={{
                      position:
                        "absolute",

                      top:
                        10,

                      right:
                        12,

                      zIndex:
                        1,

                      padding:
                        "2px 7px",

                      borderRadius:
                        999,

                      fontSize:
                        11,

                      fontWeight:
                        600,

                      background:
                        "var(--surface-muted, #f1f5f9)",

                      border:
                        "1px solid var(--border-color, #e5e7eb)",
                    }}
                  >
                    Required
                  </div>
                )}


                <RolePermissionCard
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
                    disabled ||
                    locked ||
                    !hasAllowedScopes
                  }

                  onToggle={
                    onTogglePermission
                  }

                  onScopeChange={
                    onScopeChange
                  }
                />
              </div>
            );
          },
        )}
      </div>
    </div>
  );
};


export default RolePermissionGroup;