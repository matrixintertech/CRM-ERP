import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import ProjectCategoryForm from "./ProjectCategoryForm";

import type {
  CreateProjectCategoryRequest,
} from "../types/project-category.types";


interface Props {

  title: string;

  open: boolean;

  isEdit: boolean;

  loading: boolean;


  formData:
    CreateProjectCategoryRequest;


  setFormData:
    React.Dispatch<
      React.SetStateAction<
        CreateProjectCategoryRequest
      >
    >;


  onClose: () => void;

  onSubmit: () => void;

}



const ProjectCategoryModal = ({
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

      <ProjectCategoryForm
        formData={
          formData
        }

        setFormData={
          setFormData
        }

        isEdit={
          isEdit
        }
      />


      <div
        style={{
          display:
            "flex",

          justifyContent:
            "flex-end",

          gap:
            12,

          marginTop:
            24,
        }}
      >

        <Button
          variant="secondary"
          onClick={
            onClose
          }
        >
          Cancel
        </Button>


        <Button
          loading={
            loading
          }

          onClick={
            onSubmit
          }
        >

          {isEdit
            ? "Update Category"
            : "Create Category"}

        </Button>

      </div>


    </Modal>

  );
};


export default ProjectCategoryModal;