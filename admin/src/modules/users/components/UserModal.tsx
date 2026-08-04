import {
  useEffect,
  useState,
} from "react";

import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";
import Select from "@/shared/components/Select";

import type {
  User,
  UserStatus,
} from "../types/user.types";

interface Option {
  label: string;
  value: string;
}

export interface UserFormData {
  roleUuid: string;
  status: UserStatus;
}

interface Props {
  open: boolean;

  loading: boolean;

  user:
    | User
    | null;

  roleOptions:
    Option[];

  onClose: () => void;

  onSubmit: (
    formData: UserFormData,
  ) => Promise<void> | void;
}

const initialFormData:
  UserFormData = {
  roleUuid: "",
  status: "ACTIVE",
};

const UserModal = ({
  open,
  loading,
  user,
  roleOptions,
  onClose,
  onSubmit,
}: Props) => {
  const [
    formData,
    setFormData,
  ] =
    useState<UserFormData>(
      initialFormData,
    );

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormData({
      roleUuid:
        user?.role?.uuid ?? "",

      status:
        user?.status ??
        "ACTIVE",
    });
  }, [
    open,
    user,
  ]);

  const handleSubmit = async () => {
    if (!formData.roleUuid) {
      return;
    }

    await onSubmit(
      formData,
    );
  };

  const displayName =
    user?.displayName ??
    user?.employee
      ?.displayName ??
    "User";

  return (
    <Modal
      open={open}
      title="Edit User Account"
      onClose={onClose}
      size="md"
    >
      {!user ? (
        <p>
          User information not found.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 24,
          }}
        >
          {/* User summary */}

          <section
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              paddingBottom: 20,
              borderBottom:
                "1px solid #e5e7eb",
            }}
          >
            {user.profilePhoto ||
            user.employee?.avatarUrl ? (
              <img
                src={
                  user.profilePhoto ??
                  user.employee
                    ?.avatarUrl ??
                  ""
                }
                alt={displayName}
                style={{
                  width: 54,
                  height: 54,
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
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "center",
                  background:
                    "#f3f4f6",
                  color: "#374151",
                  fontSize: 20,
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
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {displayName}
              </div>

              <div
                style={{
                  marginTop: 3,
                  color: "#6b7280",
                  fontSize: 13,
                }}
              >
                {user.email ??
                  user.mobile ??
                  "-"}
              </div>

              {user.employee
                ?.employeeCode && (
                <div
                  style={{
                    marginTop: 3,
                    color:
                      "#6b7280",
                    fontSize: 12,
                  }}
                >
                  {
                    user.employee
                      .employeeCode
                  }
                </div>
              )}
            </div>
          </section>

          {/* Form */}

          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            <Select
              label="Login Role"
              value={
                formData.roleUuid
              }
              options={
                roleOptions
              }
              onChange={(event) =>
                setFormData(
                  (previous) => ({
                    ...previous,

                    roleUuid:
                      event.target
                        .value,
                  }),
                )
              }
            />

            <Select
              label="Account Status"
              value={
                formData.status
              }
              options={[
                {
                  label:
                    "Active",
                  value:
                    "ACTIVE",
                },
                {
                  label:
                    "Inactive",
                  value:
                    "INACTIVE",
                },
                {
                  label:
                    "Suspended",
                  value:
                    "SUSPENDED",
                },
                {
                  label:
                    "Pending",
                  value:
                    "PENDING",
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
          </div>

          {/* Actions */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "flex-end",
              gap: 12,
            }}
          >
            <Button
              type="button"
              variant="secondary"
              disabled={loading}
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="button"
              loading={loading}
              disabled={
                !formData.roleUuid
              }
              onClick={
                handleSubmit
              }
            >
              Update Account
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default UserModal;