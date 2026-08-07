import type {
  Dispatch,
  SetStateAction,
} from "react";

import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import ProjectRoleForm from "./ProjectRoleForm";

import type {
  ProjectRoleFormData,
} from "../types/project-role.types";

interface Props {
  title: string;

  open: boolean;

  isEdit: boolean;

  loading: boolean;

  formData: ProjectRoleFormData;

  setFormData: Dispatch<
    SetStateAction<ProjectRoleFormData>
  >;

  onClose: () => void;

  onSubmit: () => void;
}

const ProjectRoleModal = ({
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
      <ProjectRoleForm
        formData={formData}
        setFormData={setFormData}
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
            ? "Update Project Role"
            : "Create Project Role"}
        </Button>
      </div>
    </Modal>
  );
};

export default ProjectRoleModal;