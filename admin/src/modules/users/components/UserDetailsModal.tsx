import Badge from "@/shared/components/Badge";
import Modal from "@/shared/components/Modal";

import type {
  User,
} from "../types/user.types";

interface Props {
  open: boolean;

  loading: boolean;

  user:
    | User
    | null;

  onClose: () => void;
}

interface DetailItemProps {
  label: string;

  value?:
    React.ReactNode;
}

const DetailItem = ({
  label,
  value,
}: DetailItemProps) => (
  <div>
    <div
      style={{
        marginBottom: 4,

        color: "#6b7280",

        fontSize: 12,

        fontWeight: 500,
      }}
    >
      {label}
    </div>

    <div
      style={{
        color: "#111827",

        fontSize: 14,

        fontWeight: 600,

        wordBreak:
          "break-word",
      }}
    >
      {value === undefined ||
      value === null ||
      value === ""
        ? "-"
        : value}
    </div>
  </div>
);

const formatEnumValue = (
  value?:
    | string
    | null,
) => {
  if (!value) {
    return "-";
  }

  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part
          .charAt(0)
          .toUpperCase() +
        part.slice(1),
    )
    .join(" ");
};

const formatDate = (
  value?:
    | string
    | null,
) => {
  if (!value) {
    return "-";
  }

  return new Date(
    value,
  ).toLocaleString(
    "en-IN",
  );
};

const UserDetailsModal = ({
  open,
  loading,
  user,
  onClose,
}: Props) => {
  const profileImage =
    user?.profilePhoto ??
    user?.employee
      ?.avatarUrl ??
    null;

  const displayName =
    user?.displayName ??
    user?.employee
      ?.displayName ??
    "User";

  return (
    <Modal
      open={open}
      title="User Details"
      onClose={onClose}
      size="lg"
    >
      {loading ? (
        <p>
          Loading user...
        </p>
      ) : !user ? (
        <p>
          User information
          not found.
        </p>
      ) : (
        <div
          style={{
            display:
              "grid",

            gap: 28,
          }}
        >
          {/* Header */}

          <section
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap: 16,

              paddingBottom:
                24,

              borderBottom:
                "1px solid #e5e7eb",
            }}
          >
            {profileImage ? (
              <img
                src={
                  profileImage
                }
                alt={
                  displayName
                }
                style={{
                  width: 72,

                  height: 72,

                  borderRadius:
                    "50%",

                  objectFit:
                    "cover",

                  border:
                    "1px solid #e5e7eb",

                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: 72,

                  height: 72,

                  borderRadius:
                    "50%",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  background:
                    "#f3f4f6",

                  color:
                    "#374151",

                  fontSize: 26,

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
              <h2
                style={{
                  margin:
                    "0 0 6px",
                }}
              >
                {displayName}
              </h2>

              <div
                style={{
                  marginBottom:
                    10,

                  color:
                    "#6b7280",
                }}
              >
                {user.role
                  ?.name ??
                  formatEnumValue(
                    user.userType,
                  )}
              </div>

              <Badge
                status={
                  user.status
                }
              />
            </div>
          </section>

          {/* Account Information */}

          <section>
            <h3
              style={{
                margin:
                  "0 0 16px",

                paddingBottom:
                  8,

                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >
              Account Information
            </h3>

            <div
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",

                gap: 20,
              }}
            >
              <DetailItem
                label="Display Name"
                value={
                  displayName
                }
              />

              <DetailItem
                label="User Type"
                value={formatEnumValue(
                  user.userType,
                )}
              />

              <DetailItem
                label="Email"
                value={
                  user.email
                }
              />

              <DetailItem
                label="Mobile"
                value={
                  user.mobile
                }
              />

              <DetailItem
                label="Login Role"
                value={
                  user.role
                    ?.name
                }
              />

              <DetailItem
                label="Status"
                value={
                  <Badge
                    status={
                      user.status
                    }
                  />
                }
              />

              <DetailItem
                label="Email Verified"
                value={
                  user.emailVerified
                    ? "Yes"
                    : "No"
                }
              />

              <DetailItem
                label="Mobile Verified"
                value={
                  user.mobileVerified
                    ? "Yes"
                    : "No"
                }
              />
            </div>
          </section>

          {/* Employee Information */}

          {user.employee && (
            <section>
              <h3
                style={{
                  margin:
                    "0 0 16px",

                  paddingBottom:
                    8,

                  borderBottom:
                    "1px solid #e5e7eb",
                }}
              >
                Employee Information
              </h3>

              <div
                style={{
                  display:
                    "grid",

                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",

                  gap: 20,
                }}
              >
                <DetailItem
                  label="Employee Code"
                  value={
                    user.employee
                      .employeeCode
                  }
                />

                <DetailItem
                  label="Employee Name"
                  value={
                    user.employee
                      .displayName
                  }
                />

                <DetailItem
                  label="Branch / Office"
                  value={
                    user.employee
                      .organizationUnit
                      ?.name
                  }
                />

                <DetailItem
                  label="Department"
                  value={
                    user.employee
                      .department
                      ?.name
                  }
                />

                <DetailItem
                  label="Designation"
                  value={
                    user.employee
                      .designation
                      ?.name
                  }
                />

                <DetailItem
                  label="Employee Email"
                  value={
                    user.employee
                      .email
                  }
                />

                <DetailItem
                  label="Employee Mobile"
                  value={
                    user.employee
                      .mobile
                  }
                />
              </div>
            </section>
          )}

          {/* Company Information */}

          {user.company && (
            <section>
              <h3
                style={{
                  margin:
                    "0 0 16px",

                  paddingBottom:
                    8,

                  borderBottom:
                    "1px solid #e5e7eb",
                }}
              >
                Company Information
              </h3>

              <div
                style={{
                  display:
                    "grid",

                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",

                  gap: 20,
                }}
              >
                <DetailItem
                  label="Company"
                  value={
                    user.company
                      .name
                  }
                />

                <DetailItem
                  label="Company Code"
                  value={
                    user.company
                      .code
                  }
                />
              </div>
            </section>
          )}

          {/* Activity Information */}

          <section>
            <h3
              style={{
                margin:
                  "0 0 16px",

                paddingBottom:
                  8,

                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >
              Activity Information
            </h3>

            <div
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",

                gap: 20,
              }}
            >
              <DetailItem
                label="Last Login"
                value={formatDate(
                  user.lastLoginAt,
                )}
              />

              <DetailItem
                label="Last Active"
                value={formatDate(
                  user.lastActiveAt,
                )}
              />

              <DetailItem
                label="Account Created"
                value={formatDate(
                  user.createdAt,
                )}
              />

              <DetailItem
                label="Last Updated"
                value={formatDate(
                  user.updatedAt,
                )}
              />
            </div>
          </section>
        </div>
      )}
    </Modal>
  );
};

export default UserDetailsModal;