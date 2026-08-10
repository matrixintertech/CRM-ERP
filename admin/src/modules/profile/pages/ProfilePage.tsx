import type { ReactNode } from "react";

import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

import Badge from "@/shared/components/Badge";
import Card from "@/shared/components/Card";
import PageHeader from "@/shared/components/PageHeader";

import { useProfile } from "../hooks/useProfile";

interface DetailItemProps {
  label: string;
  value?: ReactNode;
}

const DetailItem = ({
  label,
  value,
}: DetailItemProps) => (
  <div>
    <div
      style={{
        fontSize: 12,
        color: "#6b7280",
        fontWeight: 500,
        marginBottom: 6,
      }}
    >
      {label}
    </div>

    <div
      style={{
        fontSize: 14,
        color: "#111827",
        fontWeight: 600,
        wordBreak: "break-word",
      }}
    >
      {value || "-"}
    </div>
  </div>
);

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

const ProfilePage = () => {
  useDocumentTitle("User Profile");

  const {
    loading,
    profile,
  } = useProfile();

  return (
    <>
      <PageHeader
        title="User Profile"
        subtitle="View your profile and account information"
      />

      <Card>
        {loading ? (
          <p>Loading profile...</p>
        ) : !profile ? (
          <p>
            Profile information not found.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 28,
            }}
          >
            <section
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                paddingBottom: 24,
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >
              {profile.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt={
                    profile.displayName ??
                    "Profile"
                  }
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border:
                      "1px solid #e5e7eb",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                    background: "#f3f4f6",
                    color: "#374151",
                    fontSize: 28,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {(
                    profile.displayName ??
                    profile.email ??
                    profile.mobile ??
                    "U"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div>
                <h2
                  style={{
                    margin: 0,
                    marginBottom: 6,
                  }}
                >
                  {profile.displayName ??
                    profile.employee
                      ?.displayName ??
                    "User"}
                </h2>

                <div
                  style={{
                    color: "#6b7280",
                    marginBottom: 10,
                  }}
                >
                  {profile.role?.name ??
                    formatEnumValue(
                      profile.userType,
                    )}
                </div>

                <Badge
                  status={profile.status}
                />
              </div>
            </section>

            <section>
              <h3
                style={{
                  marginBottom: 16,
                  paddingBottom: 8,
                  borderBottom:
                    "1px solid #e5e7eb",
                }}
              >
                Personal Information
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: 20,
                }}
              >
                <DetailItem
                  label="Display Name"
                  value={
                    profile.displayName ??
                    profile.employee
                      ?.displayName
                  }
                />

                <DetailItem
                  label="Email"
                  value={profile.email}
                />

                <DetailItem
                  label="Mobile"
                  value={
                    profile.mobile ??
                    profile.employee?.mobile
                  }
                />

                <DetailItem
                  label="User Type"
                  value={formatEnumValue(
                    profile.userType,
                  )}
                />

                <DetailItem
                  label="Status"
                  value={
                    <Badge
                      status={
                        profile.status
                      }
                    />
                  }
                />
              </div>
            </section>

            <section>
              <h3
                style={{
                  marginBottom: 16,
                  paddingBottom: 8,
                  borderBottom:
                    "1px solid #e5e7eb",
                }}
              >
                Organization Information
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: 20,
                }}
              >
                <DetailItem
                  label="Company"
                  value={
                    profile.company?.name
                  }
                />

                <DetailItem
                  label="Login Role"
                  value={
                    profile.role?.name
                  }
                />

                <DetailItem
                  label="Employee Code"
                  value={
                    profile.employee
                      ?.employeeCode
                  }
                />

                <DetailItem
                  label="Branch / Office"
                  value={
                    profile.employee
                      ?.organizationUnit
                      ?.name
                  }
                />

                <DetailItem
                  label="Department"
                  value={
                    profile.employee
                      ?.department?.name
                  }
                />

                <DetailItem
                  label="Designation"
                  value={
                    profile.employee
                      ?.designation?.name
                  }
                />

                <DetailItem
                  label="Employment Type"
                  value={formatEnumValue(
                    profile.employee
                      ?.employmentType,
                  )}
                />

                <DetailItem
                  label="Joining Date"
                  value={
                    profile.employee
                      ?.joiningDate
                      ? new Date(
                          profile.employee
                            .joiningDate,
                        ).toLocaleDateString(
                          "en-IN",
                        )
                      : "-"
                  }
                />
              </div>
            </section>

            <section>
              <h3
                style={{
                  marginBottom: 16,
                  paddingBottom: 8,
                  borderBottom:
                    "1px solid #e5e7eb",
                }}
              >
                Account Information
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: 20,
                }}
              >
                <DetailItem
                  label="Email Verified"
                  value={
                    profile.emailVerified
                      ? "Yes"
                      : "No"
                  }
                />

                <DetailItem
                  label="Mobile Verified"
                  value={
                    profile.mobileVerified
                      ? "Yes"
                      : "No"
                  }
                />

                <DetailItem
                  label="Last Login"
                  value={
                    profile.lastLoginAt
                      ? new Date(
                          profile.lastLoginAt,
                        ).toLocaleString(
                          "en-IN",
                        )
                      : "-"
                  }
                />

                <DetailItem
                  label="Account Created"
                  value={
                    profile.createdAt
                      ? new Date(
                          profile.createdAt,
                        ).toLocaleString(
                          "en-IN",
                        )
                      : "-"
                  }
                />
              </div>
            </section>
          </div>
        )}
      </Card>
    </>
  );
};

export default ProfilePage;