import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import type {
  CreateProjectCategoryRequest,
} from "../types/project-category.types";

import styles from "./ProjectCategoryForm.module.css";


interface Props {

  formData:
    CreateProjectCategoryRequest;


  setFormData:
    React.Dispatch<
      React.SetStateAction<
        CreateProjectCategoryRequest
      >
    >;


  isEdit?: boolean;

}



const ProjectCategoryForm = ({
  formData,
  setFormData,
  isEdit = false,

}: Props) => {


  return (

    <div className={styles.form}>


      <Input
        label="Category Name"
        value={
          formData.name
        }
        onChange={(e) =>
          setFormData(
            (prev) => ({
              ...prev,

              name:
                e.target.value,
            }),
          )
        }
      />



      <Input
        label="Code"
        value={
          formData.code
        }
        onChange={(e) =>
          setFormData(
            (prev) => ({
              ...prev,

              code:
                e.target.value
                  .toUpperCase()
                  .replace(
                    /\s+/g,
                    "_",
                  ),
            }),
          )
        }
      />



      <Input
        label="Description"
        value={
          formData.description ??
          ""
        }
        onChange={(e) =>
          setFormData(
            (prev) => ({
              ...prev,

              description:
                e.target.value,
            }),
          )
        }
      />



      <div
        className={
          styles.colorWrapper
        }
      >

        <label>
          Color
        </label>


        <input
          type="color"
          value={
            formData.color ??
            "#3B82F6"
          }
          onChange={(e) =>
            setFormData(
              (prev) => ({
                ...prev,

                color:
                  e.target.value,
              }),
            )
          }
        />

      </div>




      <Input
        type="number"
        label="Sort Order"
        value={
          String(
            formData.sortOrder ??
            0,
          )
        }
        onChange={(e) =>
          setFormData(
            (prev) => ({
              ...prev,

              sortOrder:
                Number(
                  e.target.value,
                ),
            }),
          )
        }
      />




      {isEdit && (

        <Select

          label="Status"

          value={
            formData.status ??
            "ACTIVE"
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

          ]}


          onChange={(e) =>
            setFormData(
              (prev) => ({
                ...prev,

                status:
                  e.target.value as
                    | "ACTIVE"
                    | "INACTIVE",
              }),
            )
          }

        />

      )}


    </div>

  );
};


export default ProjectCategoryForm;