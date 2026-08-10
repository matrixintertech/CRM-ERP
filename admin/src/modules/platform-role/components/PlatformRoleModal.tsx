import {
  useEffect,
  useState,
} from "react";

import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import type {
  PlatformRole,
  PlatformRoleFormData,
  PlatformRoleStatus,
} from "../types/platform-role.types";

interface Props {
  open: boolean;

  loading: boolean;

  role:
    | PlatformRole
    | null;

  onClose: () => void;

  onSubmit: (
    formData:
      PlatformRoleFormData,
  ) => Promise<void>;
}

const initialFormData:
  PlatformRoleFormData = {
    name: "",

    code: "",

    description: "",

    status: "ACTIVE",
  };

const PlatformRoleModal = ({
  open,
  loading,
  role,
  onClose,
  onSubmit,
}: Props) => {
  const [
    formData,
    setFormData,
  ] = useState<
    PlatformRoleFormData
  >(
    initialFormData,
  );

  const [
    errors,
    setErrors,
  ] = useState<
    Partial<
      Record<
        keyof PlatformRoleFormData,
        string
      >
    >
  >({});

  const isEdit =
    Boolean(
      role,
    );

  /*
   * Create modal:
   * reset form.
   *
   * Edit modal:
   * selected role load karo.
   */
  useEffect(() => {
    if (
      !open
    ) {
      return;
    }

    if (
      role
    ) {
      setFormData({
        name:
          role.name,

        code:
          role.code,

        description:
          role.description ??
          "",

        status:
          role.status,
      });
    } else {
      setFormData({
        ...initialFormData,
      });
    }

    setErrors({});
  }, [
    open,
    role,
  ]);

  const handleChange = (
    field:
      keyof PlatformRoleFormData,

    value:
      string,
  ) => {
    setFormData(
      (
        previous,
      ) => ({
        ...previous,

        [field]:
          value,
      }),
    );

    setErrors(
      (
        previous,
      ) => ({
        ...previous,

        [field]:
          undefined,
      }),
    );
  };

  const validate = () => {
    const nextErrors:
      Partial<
        Record<
          keyof PlatformRoleFormData,
          string
        >
      > = {};

    const name =
      formData.name
        .trim();

    const code =
      formData.code
        .trim();

    if (
      !name
    ) {
      nextErrors.name =
        "Role name is required.";
    } else if (
      name.length <
      2
    ) {
      nextErrors.name =
        "Role name must be at least 2 characters.";
    }

    if (
      !code
    ) {
      nextErrors.code =
        "Role code is required.";
    } else if (
      code.length <
      2
    ) {
      nextErrors.code =
        "Role code must be at least 2 characters.";
    }

    setErrors(
      nextErrors,
    );

    return (
      Object.keys(
        nextErrors,
      ).length ===
      0
    );
  };

  const handleSubmit =
    async () => {
      if (
        !validate()
      ) {
        return;
      }

      await onSubmit({
        name:
          formData.name
            .trim(),

        code:
          formData.code
            .trim()
            .toUpperCase(),

        description:
          formData.description
            .trim(),

        status:
          formData.status,
      });
    };

  return (
    <Modal
      open={
        open
      }
      title={
        isEdit
          ? "Edit Platform Role"
          : "Add Platform Role"
      }
      onClose={
        onClose
      }
      size="md"
    >
      <div
        style={{
          display:
            "grid",

          gap:
            18,
        }}
      >
        <Input
          label="Role Name"
          placeholder="e.g. Operations Admin"
          value={
            formData.name
          }
          disabled={
            loading
          }
          onChange={(
            event,
          ) =>
            handleChange(
              "name",

              event.target
                .value,
            )
          }
        />

        {errors.name && (
          <div
            style={{
              marginTop:
                -12,

              color:
                "#dc2626",

              fontSize:
                12,
            }}
          >
            {
              errors.name
            }
          </div>
        )}

        <Input
          label="Role Code"
          placeholder="e.g. OPERATIONS_ADMIN"
          value={
            formData.code
          }
          disabled={
            loading ||
            Boolean(
              role?.isSystem,
            )
          }
          onChange={(
            event,
          ) =>
            handleChange(
              "code",

              event.target
                .value
                .toUpperCase(),
            )
          }
        />

        {errors.code && (
          <div
            style={{
              marginTop:
                -12,

              color:
                "#dc2626",

              fontSize:
                12,
            }}
          >
            {
              errors.code
            }
          </div>
        )}

        <div>
          <label
            style={{
              display:
                "block",

              marginBottom:
                6,

              color:
                "#374151",

              fontSize:
                13,

              fontWeight:
                500,
            }}
          >
            Description
          </label>

          <textarea
            rows={
              4
            }
            placeholder="Describe what this platform role is used for..."
            value={
              formData.description
            }
            disabled={
              loading
            }
            onChange={(
              event,
            ) =>
              handleChange(
                "description",

                event.target
                  .value,
              )
            }
            style={{
              width:
                "100%",

              boxSizing:
                "border-box",

              resize:
                "vertical",

              padding:
                "10px 12px",

              border:
                "1px solid #d1d5db",

              borderRadius:
                8,

              color:
                "#111827",

              background:
                loading
                  ? "#f3f4f6"
                  : "#ffffff",

              fontFamily:
                "inherit",

              fontSize:
                14,

              lineHeight:
                1.5,

              outline:
                "none",
            }}
          />
        </div>

        {isEdit && (
          <Select
            label="Status"
            value={
              formData.status
            }
            disabled={
              loading
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
            ]}
            onChange={(
              event,
            ) =>
              handleChange(
                "status",

                event.target
                  .value as
                  PlatformRoleStatus,
              )
            }
          />
        )}

        {role?.isSystem && (
          <div
            style={{
              padding:
                "10px 12px",

              border:
                "1px solid #fde68a",

              borderRadius:
                8,

              background:
                "#fffbeb",

              color:
                "#92400e",

              fontSize:
                12,

              lineHeight:
                1.5,
            }}
          >
            This is a system platform role.
            Its role code is protected from
            editing.
          </div>
        )}

        <div
          style={{
            display:
              "flex",

            justifyContent:
              "flex-end",

            flexWrap:
              "wrap",

            gap:
              10,

            paddingTop:
              8,

            borderTop:
              "1px solid #e5e7eb",
          }}
        >
          <Button
            type="button"
            variant="secondary"
            disabled={
              loading
            }
            onClick={
              onClose
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            loading={
              loading
            }
            onClick={
              handleSubmit
            }
          >
            {isEdit
              ? "Update Role"
              : "Create Role"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PlatformRoleModal;