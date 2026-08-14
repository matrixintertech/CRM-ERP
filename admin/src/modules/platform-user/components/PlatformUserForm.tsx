import type {
  Dispatch,
  SetStateAction,
} from "react";

import {
  useQuery,
} from "@tanstack/react-query";

import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import api from "@/shared/services/axios";

import type {
  PlatformUserFormData,
} from "../types/platform-user.types";

import styles from "./PlatformUserForm.module.css";


interface Props {
  formData:
    PlatformUserFormData;

  setFormData:
    Dispatch<
      SetStateAction<
        PlatformUserFormData
      >
    >;

  isEdit: boolean;
}


interface PlatformRoleDropdownItem {
  uuid: string;
  name: string;
  code: string;
}


interface PlatformRoleDropdownResponse {
  message: string;

  roles:
    PlatformRoleDropdownItem[];
}


interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}


const getPlatformRoleDropdown =
  async (): Promise<
    PlatformRoleDropdownItem[]
  > => {
    const {
      data,
    } =
      await api.get<
        ApiResponse<
          PlatformRoleDropdownResponse
        >
      >(
        "/platform/roles/dropdown",
      );

    return data.data.roles;
  };


const PlatformUserForm = ({
  formData,
  setFormData,
  isEdit,
}: Props) => {
  const {
    data:
      platformRoles = [],

    isLoading:
      rolesLoading,
  } = useQuery({
    queryKey: [
      "platform-role-dropdown",
    ],

    queryFn:
      getPlatformRoleDropdown,

    staleTime:
      5 * 60 * 1000,
  });


  return (
    <div
      className={
        styles.form
      }
    >
      <Input
        label="Display Name"
        value={
          formData.displayName
        }
        onChange={(
          event,
        ) =>
          setFormData(
            (
              previous,
            ) => ({
              ...previous,

              displayName:
                event.target.value,
            }),
          )
        }
        required
      />


      <Input
        type="email"
        label="Email"
        value={
          formData.email
        }
        onChange={(
          event,
        ) =>
          setFormData(
            (
              previous,
            ) => ({
              ...previous,

              email:
                event.target.value,
            }),
          )
        }
        required
      />


      <Input
        label="Mobile"
        value={
          formData.mobile
        }
        onChange={(
          event,
        ) =>
          setFormData(
            (
              previous,
            ) => ({
              ...previous,

              mobile:
                event.target.value,
            }),
          )
        }
      />


      <Select
        label="Platform Role"
        value={
          formData.platformRoleUuid
        }
        options={[
          {
            label:
              rolesLoading
                ? "Loading roles..."
                : "Select Platform Role",

            value: "",
          },

          ...platformRoles.map(
            (
              role,
            ) => ({
              label:
                `${role.name} (${role.code})`,

              value:
                role.uuid,
            }),
          ),
        ]}
        onChange={(
          event,
        ) =>
          setFormData(
            (
              previous,
            ) => ({
              ...previous,

              platformRoleUuid:
                event.target.value,
            }),
          )
        }
        disabled={
          rolesLoading
        }
        required
      />


      {isEdit && (
        <Select
          label="Status"
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
          ]}
          onChange={(
            event,
          ) =>
            setFormData(
              (
                previous,
              ) => ({
                ...previous,

                status:
                  event.target.value as PlatformUserFormData["status"],
              }),
            )
          }
        />
      )}
    </div>
  );
};


export default PlatformUserForm;