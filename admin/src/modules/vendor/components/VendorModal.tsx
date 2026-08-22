import {
  useEffect,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import Modal from "@/shared/components/Modal";
import Input from "@/shared/components/Input";
import Textarea from "@/shared/components/Textarea";
import Button from "@/shared/components/Button";

import styles from "./VendorModal.module.css";

import type {
  CreateVendorDto,
  Vendor,
} from "../types/vendor.types";


interface Props {
  open: boolean;

  vendor:
    Vendor | null;

  loading?: boolean;

  onClose:
    () => void;

  onSubmit: (
    data: CreateVendorDto,
  ) => Promise<void>;
}


const initialFormData:
  CreateVendorDto = {
  legalName: "",
  displayName: "",
  panNumber: "",
  primaryGstNumber: "",
  email: "",
  mobile: "",
  website: "",
  address: "",
  pincode: "",
  remarks: "",
};


const VendorModal = ({
  open,
  vendor,
  loading = false,
  onClose,
  onSubmit,
}: Props) => {
  const [
    formData,
    setFormData,
  ] =
    useState<CreateVendorDto>({
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


    if (vendor) {
      setFormData({
        legalName:
          vendor.legalName ??
          "",

        displayName:
          vendor.displayName ??
          "",

        panNumber:
          vendor.panNumber ??
          "",

        primaryGstNumber:
          vendor.primaryGstNumber ??
          "",

        email:
          vendor.email ??
          "",

        mobile:
          vendor.mobile ??
          "",

        website:
          vendor.website ??
          "",

        address:
          vendor.address ??
          "",

        pincode:
          vendor.pincode ??
          "",

        remarks:
          vendor.remarks ??
          "",
      });

      return;
    }


    setFormData({
      ...initialFormData,
    });
  }, [
    open,
    vendor,
  ]);


  /*
   * =========================================================
   * FIELD CHANGE
   * =========================================================
   */

  const handleChange = (
    event:
      ChangeEvent<
        | HTMLInputElement
        | HTMLTextAreaElement
      >,
  ) => {
    const {
      name,
      value,
    } = event.target;


    let nextValue =
      value;


    /*
     * PAN / GST uppercase.
     */
    if (
      name ===
        "panNumber" ||
      name ===
        "primaryGstNumber"
    ) {
      nextValue =
        value.toUpperCase();
    }


    /*
     * Email lowercase.
     */
    if (
      name ===
      "email"
    ) {
      nextValue =
        value.toLowerCase();
    }


    setFormData(
      (previous) => ({
        ...previous,

        [name]:
          nextValue,
      }),
    );
  };


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


      const legalName =
        formData
          .legalName
          .trim();


      if (!legalName) {
        return;
      }


      const payload:
        CreateVendorDto = {
        legalName,

        displayName:
          formData
            .displayName
            ?.trim() ||
          undefined,

        panNumber:
          formData
            .panNumber
            ?.trim()
            .toUpperCase() ||
          undefined,

        primaryGstNumber:
          formData
            .primaryGstNumber
            ?.trim()
            .toUpperCase() ||
          undefined,

        email:
          formData
            .email
            ?.trim()
            .toLowerCase() ||
          undefined,

        mobile:
          formData
            .mobile
            ?.trim() ||
          undefined,

        website:
          formData
            .website
            ?.trim() ||
          undefined,

        address:
          formData
            .address
            ?.trim() ||
          undefined,

        pincode:
          formData
            .pincode
            ?.trim() ||
          undefined,

        remarks:
          formData
            .remarks
            ?.trim() ||
          undefined,
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
      vendor,
    );


  const canSubmit =
    Boolean(
      formData
        .legalName
        .trim(),
    ) &&
    !loading;


  return (
    <Modal
      open={
        open
      }
      title={
        isEdit
          ? "Edit Vendor"
          : "Add Vendor"
      }
      onClose={
        handleClose
      }
      size="lg"
    >
      <form
        id="vendor-form"
        onSubmit={
          handleSubmit
        }
        className={
          styles.form
        }
      >
        {/*
         * =====================================================
         * BUSINESS INFORMATION
         * =====================================================
         */}

        <h4
          className={
            styles.section
          }
        >
          Business Information
        </h4>


        <div
          className={
            styles.form2
          }
        >
          <Input
            label="Legal Name"
            name="legalName"
            value={
              formData.legalName
            }
            onChange={
              handleChange
            }
            placeholder="e.g. Urban Woodcraft Private Limited"
            disabled={
              loading
            }
            required
          />


          <Input
            label="Display Name"
            name="displayName"
            value={
              formData.displayName ??
              ""
            }
            onChange={
              handleChange
            }
            placeholder="e.g. Urban Woodcraft"
            disabled={
              loading
            }
          />
        </div>


        {/*
         * =====================================================
         * TAX INFORMATION
         * =====================================================
         */}

        <h4
          className={
            styles.section
          }
        >
          Tax Information
        </h4>


        <div
          className={
            styles.form2
          }
        >
          <Input
            label="PAN Number"
            name="panNumber"
            value={
              formData.panNumber ??
              ""
            }
            onChange={
              handleChange
            }
            placeholder="AAAAA1234A"
            disabled={
              loading
            }
          />


          <Input
            label="GST Number"
            name="primaryGstNumber"
            value={
              formData.primaryGstNumber ??
              ""
            }
            onChange={
              handleChange
            }
            placeholder="07AAAAA1234A1Z5"
            disabled={
              loading
            }
          />
        </div>


        {/*
         * =====================================================
         * CONTACT INFORMATION
         * =====================================================
         */}

        <h4
          className={
            styles.section
          }
        >
          Contact Information
        </h4>


        <div
          className={
            styles.form2
          }
        >
          <Input
            type="email"
            label="Email Address"
            name="email"
            value={
              formData.email ??
              ""
            }
            onChange={
              handleChange
            }
            placeholder="accounts@vendor.com"
            disabled={
              loading
            }
          />


          <Input
            label="Mobile Number"
            name="mobile"
            value={
              formData.mobile ??
              ""
            }
            onChange={
              handleChange
            }
            placeholder="9876543210"
            disabled={
              loading
            }
          />


          <div
            className={
              styles.fullWidth
            }
          >
            <Input
              label="Website"
              name="website"
              value={
                formData.website ??
                ""
              }
              onChange={
                handleChange
              }
              placeholder="https://www.vendor.com"
              disabled={
                loading
              }
            />
          </div>
        </div>


        {/*
         * =====================================================
         * ADDRESS INFORMATION
         * =====================================================
         */}

        <h4
          className={
            styles.section
          }
        >
          Address Information
        </h4>


        <div
          className={
            styles.addressRow
          }
        >
          <Textarea
            label="Business Address"
            name="address"
            value={
              formData.address ??
              ""
            }
            onChange={
              handleChange
            }
            rows={3}
            placeholder="Office / shop / warehouse address"
            disabled={
              loading
            }
          />


          <Input
            label="Pincode"
            name="pincode"
            value={
              formData.pincode ??
              ""
            }
            onChange={
              handleChange
            }
            placeholder="110001"
            disabled={
              loading
            }
          />
        </div>


        {/*
         * =====================================================
         * OTHER INFORMATION
         * =====================================================
         */}

        <h4
          className={
            styles.section
          }
        >
          Other Information
        </h4>


        <Textarea
          label="Remarks"
          name="remarks"
          value={
            formData.remarks ??
            ""
          }
          onChange={
            handleChange
          }
          rows={3}
          placeholder="Internal notes or additional information..."
          disabled={
            loading
          }
        />


        {/*
         * =====================================================
         * ACTIONS
         * =====================================================
         */}

        <div
          className={
            styles.actions
          }
        >
          <p
            className={
              styles.helperText
            }
          >
            Legal Name is required.
            Other information can
            be added later.
          </p>


          <div
            className={
              styles.actionButtons
            }
          >
            <Button
              type="button"
              variant="secondary"
              onClick={
                handleClose
              }
              disabled={
                loading
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
                ? "Update Vendor"
                : "Create Vendor"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};


export default VendorModal;