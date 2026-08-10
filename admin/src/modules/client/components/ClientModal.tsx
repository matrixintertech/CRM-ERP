import type { Dispatch, SetStateAction } from "react";

import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import ClientForm from "./ClientForm";

import type {
  CityOption,
  ClientFormData,
  StateOption,
} from "../types/client.types";

interface Props {
  title: string;
  open: boolean;
  isEdit: boolean;
  loading: boolean;
  loadingCities: boolean;

  formData: ClientFormData;

  setFormData: Dispatch<SetStateAction<ClientFormData>>;

  stateOptions: StateOption[];
  cityOptions: CityOption[];

  onStateChange: (stateUuid: string) => Promise<void>;

  onClose: () => void;
  onSubmit: () => void | Promise<void>;
}

const ClientModal = ({
  title,
  open,
  isEdit,
  loading,
  formData,
  setFormData,
  stateOptions,
  cityOptions,
  onStateChange,
  onClose,
  onSubmit,
}: Props) => {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <ClientForm
        formData={formData}
        setFormData={setFormData}
        stateOptions={stateOptions}
        cityOptions={cityOptions}
        onStateChange={onStateChange}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          marginTop: 24,
        }}
      >
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button loading={loading} onClick={onSubmit}>
          {isEdit ? "Update Client" : "Create Client"}
        </Button>
      </div>
    </Modal>
  );
};

export default ClientModal;
