import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import CityForm from "./CityForm";

import type { CityFormData } from "../types/city.types";

interface Props {
  title: string;
  open: boolean;
  isEdit: boolean;
  loading: boolean;

  formData: CityFormData;

  setFormData: React.Dispatch<
    React.SetStateAction<CityFormData>
  >;

  onClose: () => void;

  onSubmit: () => void;
}

const CityModal = ({
  title,
  open,
  isEdit,
  loading,
  formData,
  setFormData,
  onClose,
  onSubmit,
}: Props) => {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      size="md"
    >
      <CityForm
        formData={formData}
        setFormData={setFormData}
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
            ? "Update City"
            : "Create City"}
        </Button>
      </div>
    </Modal>
  );
};

export default CityModal;