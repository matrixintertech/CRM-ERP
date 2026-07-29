import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import ClientForm from "./ClientForm";

import type { CreateClientDto } from "../types/client.types";

interface Option {
  label: string;
  value: string;
}

interface Props {
  title: string;
  open: boolean;
  isEdit: boolean;
  loading: boolean;

  formData: CreateClientDto;

  setFormData: React.Dispatch<
    React.SetStateAction<CreateClientDto>
  >;

  stateOptions: Option[];
  cityOptions: Option[];

  onClose: () => void;

  onSubmit: () => void;
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
  onClose,
  onSubmit,
}: Props) => {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      size="lg"
    >
      <ClientForm
        formData={formData}
        setFormData={setFormData}
        stateOptions={stateOptions}
        cityOptions={cityOptions}
        isEdit={isEdit}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          marginTop: 24,
        }}
      >
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          loading={loading}
          onClick={onSubmit}
        >
          {isEdit
            ? "Update Client"
            : "Create Client"}
        </Button>
      </div>
    </Modal>
  );
};

export default ClientModal;