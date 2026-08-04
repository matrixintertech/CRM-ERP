import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import ProjectForm from "./ProjectForm";

import type {
  CreateProjectRequest,
} from "../types/project.types";


interface Option {
  label: string;
  value: string;
}


interface Props {

  title: string;

  open: boolean;

  isEdit: boolean;

  loading: boolean;


  formData:
    CreateProjectRequest;


  setFormData:
    React.Dispatch<
      React.SetStateAction<CreateProjectRequest>
    >;



  clientOptions:
    Option[];


  categoryOptions:
    Option[];


  branchOptions:
    Option[];



  stateOptions:
    Option[];


  cityOptions:
    Option[];



  onStateChange: (
    stateUuid: string,
  ) => Promise<void>;



  onClose: () => void;

  onSubmit: () => void;

}



const ProjectModal = ({
  title,
  open,
  isEdit,
  loading,

  formData,
  setFormData,


  clientOptions,

  categoryOptions,

  branchOptions,


  stateOptions,

  cityOptions,


  onStateChange,


  onClose,

  onSubmit,

}: Props) => {


  return (

    <Modal

      open={
        open
      }

      title={
        title
      }

      onClose={
        onClose
      }

      size="lg"

    >


      <ProjectForm

        formData={
          formData
        }


        setFormData={
          setFormData
        }



        clientOptions={
          clientOptions
        }



        categoryOptions={
          categoryOptions
        }



        branchOptions={
          branchOptions
        }



        stateOptions={
          stateOptions
        }



        cityOptions={
          cityOptions
        }



        onStateChange={
          onStateChange
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
            ? "Update Project"
            : "Create Project"}

        </Button>


      </div>


    </Modal>

  );

};


export default ProjectModal;