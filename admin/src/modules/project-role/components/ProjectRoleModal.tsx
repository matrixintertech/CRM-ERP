import type {
  Dispatch,
  SetStateAction,
} from "react";

import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import ProjectRoleForm from "./ProjectRoleForm";

import type {
  ProjectRole,
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

  projectRoles: ProjectRole[];

  currentRoleUuid?: string | null;

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

  projectRoles,
  currentRoleUuid,

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
        projectRoles={projectRoles}
        currentRoleUuid={
          currentRoleUuid
        }
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