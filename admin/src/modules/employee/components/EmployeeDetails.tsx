import styles from "./EmployeeDetails.module.css";

import type {
  Employee,
} from "../types/employee.types";

interface Props {
  employee: Employee | null;
}

const getValue = (
  value?: string | null,
) => value || "-";

const formatEnumValue = (
  value?: string | null,
) => {
  if (!value) {
    return "-";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
};

const EmployeeDetails = ({
  employee,
}: Props) => {
  if (!employee) {
    return (
      <p>
        Employee details not found.
      </p>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3>
          Personal Information
        </h3>

        <div className={styles.grid}>
          <div>
            <label>
              Employee Code
            </label>

            <span>
              {employee.employeeCode}
            </span>
          </div>

          <div>
            <label>
              First Name
            </label>

            <span>
              {employee.firstName}
            </span>
          </div>

          <div>
            <label>
              Last Name
            </label>

            <span>
              {getValue(
                employee.lastName,
              )}
            </span>
          </div>

          <div>
            <label>
              Display Name
            </label>

            <span>
              {getValue(
                employee.displayName,
              )}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>
          Contact Information
        </h3>

        <div className={styles.grid}>
          <div>
            <label>
              Email
            </label>

            <span>
              {getValue(
                employee.email,
              )}
            </span>
          </div>

          <div>
            <label>
              Mobile
            </label>

            <span>
              {getValue(
                employee.mobile,
              )}
            </span>
          </div>

          <div>
            <label>
              Gender
            </label>

            <span>
              {formatEnumValue(
                employee.gender,
              )}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>
          Organization
        </h3>

        <div className={styles.grid}>
          <div>
            <label>
              Location
            </label>

            <span>
              {employee
                .organizationUnit
                ?.name ?? "-"}
            </span>
          </div>

          <div>
            <label>
              Department
            </label>

            <span>
              {employee
                .department?.name ??
                "-"}
            </span>
          </div>

          <div>
            <label>
              Designation
            </label>

            <span>
              {employee
                .designation
                ?.name ?? "-"}
            </span>
          </div>

          <div>
            <label>
              Reporting Manager
            </label>

            <span>
              {employee.manager
                ?.displayName ??
                "No Reporting Manager"}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>
          Employment
        </h3>

        <div className={styles.grid}>
          <div>
            <label>
              Joining Date
            </label>

            <span>
              {employee.joiningDate
                ? new Date(
                    employee.joiningDate,
                  ).toLocaleDateString()
                : "-"}
            </span>
          </div>

          <div>
            <label>
              Employment Type
            </label>

            <span>
              {formatEnumValue(
                employee.employmentType,
              )}
            </span>
          </div>

          <div>
            <label>
              Employee Status
            </label>

            <span>
              {formatEnumValue(
                employee.status,
              )}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>
          Login Account
        </h3>

        {employee.user ? (
          <div className={styles.grid}>
            <div>
              <label>
                Account Status
              </label>

              <span>
                {formatEnumValue(
                  employee.user.status,
                )}
              </span>
            </div>

            <div>
              <label>
                User Type
              </label>

              <span>
                {formatEnumValue(
                  employee.user.userType,
                )}
              </span>
            </div>

            <div>
              <label>
                Assigned Role
              </label>

              <span>
                {employee.user.role
                  ? `${employee.user.role.name} (${employee.user.role.code})`
                  : "No Role Assigned"}
              </span>
            </div>

            <div>
              <label>
                Login Email
              </label>

              <span>
                {getValue(
                  employee.user.email,
                )}
              </span>
            </div>

            <div>
              <label>
                Login Mobile
              </label>

              <span>
                {getValue(
                  employee.user.mobile,
                )}
              </span>
            </div>

            <div>
              <label>
                Login Access
              </label>

              <span>
                {employee.user.status ===
                "ACTIVE"
                  ? "Enabled"
                  : "Disabled"}
              </span>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: "14px 16px",
              border:
                "1px solid var(--border-color, #e5e7eb)",
              borderRadius: 8,
              background:
                "var(--surface-muted, #f8fafc)",
              fontSize: 13,
              opacity: 0.8,
            }}
          >
            Login account has not been
            created for this employee.
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h3>
          Audit Information
        </h3>

        <div className={styles.grid}>
          <div>
            <label>
              Created At
            </label>

            <span>
              {new Date(
                employee.createdAt,
              ).toLocaleString()}
            </span>
          </div>

          <div>
            <label>
              Updated At
            </label>

            <span>
              {new Date(
                employee.updatedAt,
              ).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;