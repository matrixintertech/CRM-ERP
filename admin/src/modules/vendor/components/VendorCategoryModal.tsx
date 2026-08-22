import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";
import Textarea from "@/shared/components/Textarea";

import type {
  CreateVendorCategoryDto,
} from "../api/vendor-category.api";

import type {
  VendorCategorySummary,
} from "../types/vendor.types";

import styles from "./VendorCategoryModal.module.css";


interface Props {
  open: boolean;

  category:
    VendorCategorySummary | null;

  loading?: boolean;

  onClose:
    () => void;

  onSubmit: (
    data:
      CreateVendorCategoryDto,
  ) => Promise<void>;
}


const initialFormData:
  CreateVendorCategoryDto = {
  name: "",
  code: "",
  description: "",
  sortOrder: 0,
};


const VendorCategoryModal = ({
  open,
  category,
  loading = false,
  onClose,
  onSubmit,
}: Props) => {
  const [
    formData,
    setFormData,
  ] =
    useState<CreateVendorCategoryDto>({
      ...initialFormData,
    });


  /*
   * =========================================================
   * CREATE / EDIT DATA
   * =========================================================
   */

  useEffect(() => {
    if (!open) {
      return;
    }


    if (category) {
      setFormData({
        name:
          category.name ??
          "",

        code:
          category.code ??
          "",

        description:
          category.description ??
          "",

        sortOrder:
          category.sortOrder ??
          0,
      });

      return;
    }


    setFormData({
      ...initialFormData,
    });
  }, [
    open,
    category,
  ]);


  /*
   * =========================================================
   * FIELD CHANGE
   * =========================================================
   */

  const updateField = (
    field:
      | "name"
      | "code"
      | "description",

    value:
      string,
  ) => {
    setFormData(
      (previous) => ({
        ...previous,

        [field]:
          value,
      }),
    );
  };


  /*
   * =========================================================
   * SORT ORDER
   * =========================================================
   */

  const handleSortOrderChange = (
    value: string,
  ) => {
    const parsed =
      Number(
        value,
      );


    setFormData(
      (previous) => ({
        ...previous,

        sortOrder:
          Number.isFinite(
            parsed,
          )
            ? Math.max(
                0,
                parsed,
              )
            : 0,
      }),
    );
  };


  /*
   * =========================================================
   * NORMALIZED VALUES
   * =========================================================
   */

  const name =
    formData.name
      .trim();


  const code =
    formData.code
      .trim()
      .toUpperCase()
      .replace(
        /\s+/g,
        "_",
      );


  const canSubmit =
    Boolean(
      name &&
      code,
    ) &&
    !loading;


  /*
   * =========================================================
   * SUBMIT
   * =========================================================
   */

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();


      if (!canSubmit) {
        return;
      }


      const payload:
        CreateVendorCategoryDto = {
        name,

        code,

        description:
          formData
            .description
            ?.trim() ||
          undefined,

        sortOrder:
          Number(
            formData.sortOrder ??
              0,
          ),
      };


      await onSubmit(
        payload,
      );
    };


  /*
   * =========================================================
   * CLOSE
   * =========================================================
   */

  const handleClose =
    () => {
      if (loading) {
        return;
      }


      setFormData({
        ...initialFormData,
      });


      onClose();
    };


  const isEdit =
    Boolean(
      category,
    );


  return (
    <Modal
      open={
        open
      }
      title={
        isEdit
          ? "Edit Vendor Category"
          : "Add Vendor Category"
      }
      onClose={
        handleClose
      }
      size="md"
    >
      <form
        id="vendor-category-form"
        onSubmit={
          handleSubmit
        }
        className={
          styles.form
        }
      >
        {/* Basic Information */}

        <h4
          className={
            styles.section
          }
        >
          Category Information
        </h4>


        <div
          className={
            styles.form2
          }
        >
          <Input
            label="Category Name"
            name="name"
            placeholder="e.g. Furniture Supplier"
            value={
              formData.name
            }
            disabled={
              loading
            }
            onChange={(
              event,
            ) =>
              updateField(
                "name",
                event.target.value,
              )
            }
            required
          />


          <Input
            label="Category Code"
            name="code"
            placeholder="e.g. FURNITURE_SUPPLIER"
            value={
              formData.code
            }
            disabled={
              loading
            }
            onChange={(
              event,
            ) =>
              updateField(
                "code",
                event.target.value
                  .toUpperCase()
                  .replace(
                    /\s+/g,
                    "_",
                  ),
              )
            }
            required
          />
        </div>


        {/* Description */}

        <div
          className={
            styles.fullWidth
          }
        >
          <Textarea
            label="Description"
            name="description"
            placeholder="Brief description of this vendor category"
            value={
              formData.description ??
              ""
            }
            disabled={
              loading
            }
            onChange={(
              event,
            ) =>
              updateField(
                "description",
                event.target.value,
              )
            }
            rows={3}
          />
        </div>


        {/* Configuration */}

        <h4
          className={
            styles.section
          }
        >
          Configuration
        </h4>


        <div
          className={
            styles.form2
          }
        >
          <Input
            label="Sort Order"
            name="sortOrder"
            type="number"
            min={0}
            value={String(
              formData.sortOrder ??
                0,
            )}
            disabled={
              loading
            }
            onChange={(
              event,
            ) =>
              handleSortOrderChange(
                event.target.value,
              )
            }
          />


          <div
            className={
              styles.codePreview
            }
          >
            <div
              className={
                styles.previewLabel
              }
            >
              Category Code
            </div>

            <div
              className={
                styles.previewValue
              }
            >
              {code || "-"}
            </div>
          </div>
        </div>


        {/* Actions */}

        <div
          className={
            styles.actions
          }
        >
          <div
            className={
              styles.helperText
            }
          >
            Category name and code
            are required.
          </div>


          <div
            className={
              styles.actionButtons
            }
          >
            <Button
              type="button"
              variant="secondary"
              disabled={
                loading
              }
              onClick={
                handleClose
              }
            >
              Cancel
            </Button>


            <Button
              type="submit"
              loading={
                loading
              }
              disabled={
                !canSubmit
              }
            >
              {isEdit
                ? "Update Category"
                : "Create Category"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};


export default VendorCategoryModal;