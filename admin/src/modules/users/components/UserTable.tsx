import Badge from "@/shared/components/Badge";
import Button from "@/shared/components/Button";
import Table, {
  type Column,
} from "@/shared/components/Table";

import type {
  User,
} from "../types/user.types";

interface Props {
  data: User[];

  loading: boolean;

  onView: (
    uuid: string,
  ) => void;

  onEdit: (
    uuid: string,
  ) => void;

  onPermissions: (
    uuid: string,
  ) => void;

  canView?: (
    user: User,
  ) => boolean;

  canEdit?: (
    user: User,
  ) => boolean;

  canManagePermissions?: (
    user: User,
  ) => boolean;
}

const formatEnumValue = (
  value?: string | null,
) => {
  if (!value) {
    return "-";
  }

  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
};

const UserTable = ({
  data,
  loading,
  onView,
  onEdit,
  onPermissions,

  canView = () => true,
  canEdit = () => true,
  canManagePermissions = () => true,
}: Props) => {
  const columns:
    Column<User>[] = [
    {
      key: "displayName",
      title: "User",

      render: (_, row) => {
        const displayName =
          row.displayName ??
          row.employee?.displayName ??
          "User";

        const profilePhoto =
          row.profilePhoto ??
          row.employee?.avatarUrl ??
          null;

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={displayName}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border:
                    "1px solid #e5e7eb",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "center",
                  background:
                    "#f3f4f6",
                  color: "#374151",
                  fontSize: 14,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {displayName
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div>
              <div
                style={{
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {displayName}
              </div>

              <div
                style={{
                  marginTop: 2,
                  color: "#6b7280",
                  fontSize: 12,
                }}
              >
                {row.employee
                  ?.employeeCode ??
                  "No employee code"}
              </div>
            </div>
          </div>
        );
      },
    },

    {
      key: "email",
      title: "Email",

      render: (_, row) =>
        row.email || "-",
    },

    {
      key: "mobile",
      title: "Mobile",

      render: (_, row) =>
        row.mobile || "-",
    },

    {
      key: "role",
      title: "Role",

      render: (_, row) =>
        row.role?.name || "-",
    },

    {
      key: "userType",
      title: "User Type",

      render: (_, row) =>
        formatEnumValue(
          row.userType,
        ),
    },

    {
      key: "employee",
      title: "Branch",

      render: (_, row) =>
        row.employee
          ?.organizationUnit
          ?.name || "-",
    },

    {
      key: "status",
      title: "Status",

      render: (_, row) => (
        <Badge
          status={row.status}
        />
      ),
    },

    {
      key: "createdAt",
      title: "Created At",

      render: (_, row) =>
        row.createdAt
          ? new Date(
              row.createdAt,
            ).toLocaleDateString(
              "en-IN",
            )
          : "-",
    },

    {
      key: "action",
      title: "Action",

      render: (_, row) => {
        const showView =
          canView(row);

        const showEdit =
          canEdit(row);

        const showPermissions =
          canManagePermissions(
            row,
          );

        if (
          !showView &&
          !showEdit &&
          !showPermissions
        ) {
          return "-";
        }

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {showView && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  onView(
                    row.uuid,
                  )
                }
              >
                View
              </Button>
            )}

            {showEdit && (
              <Button
                size="sm"
                onClick={() =>
                  onEdit(
                    row.uuid,
                  )
                }
              >
                Edit
              </Button>
            )}

            {showPermissions && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  onPermissions(
                    row.uuid,
                  )
                }
              >
                Permissions
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
    />
  );
};

export default UserTable;