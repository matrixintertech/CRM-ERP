import {
  useEffect,
  useState,
} from "react";

import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";
import Select from "@/shared/components/Select";

import type {
  Employee,
  UserStatus,
} from "../types/employee.types";

import type {
  Role,
} from "../../role/types/role.types";

import {
  createEmployeeUserAccount,
  updateEmployeeUserAccount,
} from "../../users/api/employee-user-account.api";

interface Props {
  open: boolean;

  employee: Employee | null;

  roles: Role[];

  onClose: () => void;

  onSuccess: () => Promise<void> | void;
}

interface FormData {
  roleUuid: string;

  status: UserStatus;
}

const getInitialFormData = (
  employee: Employee | null,
): FormData => ({
  roleUuid:
    employee?.user?.role?.uuid ??
    "",

  status:
    employee?.user?.status ??
    "ACTIVE",
});

const EmployeeUserAccountModal = ({
  open,
  employee,
  roles,
  onClose,
  onSuccess,
}: Props) => {
  const [
    formData,
    setFormData,
  ] = useState<FormData>(
    getInitialFormData(
      employee,
    ),
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormData(
      getInitialFormData(
        employee,
      ),
    );
  }, [
    open,
    employee,
  ]);

  if (!employee) {
    return null;
  }

  const employeeName =
    employee.displayName ||
    `${employee.firstName} ${
      employee.lastName ?? ""
    }`.trim();

  const roleOptions =
    roles
      .filter(
        (role) =>
          role.status ===
          "ACTIVE",
      )
      .map((role) => ({
        label: `${role.name} (${role.code})`,
        value: role.uuid,
      }));

  const handleSubmit =
    async () => {
      if (!formData.roleUuid) {
        return;
      }

      try {
        setLoading(true);

        const payload = {
          roleUuid:
            formData.roleUuid,

          status:
            formData.status,
        };

        if (employee.user) {
          await updateEmployeeUserAccount(
            employee.uuid,
            payload,
          );
        } else {
          await createEmployeeUserAccount(
            employee.uuid,
            payload,
          );
        }

        await onSuccess();

        onClose();
      } catch (error: any) {
        console.error(
          error?.response?.data ??
            error,
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <Modal
      open={open}
      title={
        employee.user
          ? "Manage User Access"
          : "Create Login Account"
      }
      onClose={onClose}
      size="md"
    >
      <div
        style={{
          display: "grid",
          gap: 18,
        }}
      >
        <div
          style={{
            padding: 16,
            border:
              "1px solid var(--border-color, #e5e7eb)",
            borderRadius: 10,
            background:
              "var(--surface-muted, #f8fafc)",
          }}
        >
          <div
            style={{
              fontWeight: 600,
            }}
          >
            {employeeName}
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 13,
              opacity: 0.7,
            }}
          >
            {employee.employeeCode}
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 13,
            }}
          >
            Email:{" "}
            {employee.email ||
              "-"}
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 13,
            }}
          >
            Mobile:{" "}
            {employee.mobile ||
              "-"}
          </div>
        </div>

        <Select
          label="Role"
          name="roleUuid"
          placeholder="Select role"
          value={
            formData.roleUuid
          }
          options={roleOptions}
          onChange={(event) =>
            setFormData(
              (previous) => ({
                ...previous,

                roleUuid:
                  event.target.value,
              }),
            )
          }
        />

        <Select
          label="Account Status"
          name="status"
          value={
            formData.status
          }
          showPlaceholder={false}
          options={[
            {
              label: "Active",
              value: "ACTIVE",
            },
            {
              label: "Pending",
              value: "PENDING",
            },
            {
              label: "Inactive",
              value: "INACTIVE",
            },
            {
              label: "Suspended",
              value: "SUSPENDED",
            },
          ]}
          onChange={(event) =>
            setFormData(
              (previous) => ({
                ...previous,

                status:
                  event.target
                    .value as UserStatus,
              }),
            )
          }
        />

        <div
          style={{
            display: "flex",
            justifyContent:
              "flex-end",
            gap: 12,
          }}
        >
          <Button
            variant="secondary"
            disabled={loading}
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            loading={loading}
            disabled={
              loading ||
              !formData.roleUuid
            }
            onClick={
              handleSubmit
            }
          >
            {employee.user
              ? "Update Access"
              : "Create Login"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EmployeeUserAccountModal;