import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import type {
  CreateProjectRequest,
} from "../types/project.types";

import styles from "./ProjectForm.module.css";


interface Option {
  label: string;
  value: string;
}


interface Props {

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



  isEdit?: boolean;

}



const ProjectForm = ({
  formData,
  setFormData,

  clientOptions,
  categoryOptions,
  branchOptions,

  stateOptions,
  cityOptions,

  onStateChange,

  isEdit = false,

}: Props) => {


  const mappedClientOptions =
    clientOptions.map(
      (item:any)=>({
        label:item.name,
        value:item.uuid,
      }),
    );



  const mappedCategoryOptions =
  categoryOptions;


const mappedBranchOptions =
  branchOptions;



  const mappedStateOptions =
    stateOptions.map(
      (item:any)=>({
        label:item.name,
        value:item.uuid,
      }),
    );



  const mappedCityOptions =
    cityOptions.map(
      (item:any)=>({
        label:item.name,
        value:item.uuid,
      }),
    );



  return (

    <div className={styles.form}>


      {/* Client */}

      <Select

        label="Client"

        value={
          formData.clientUuid
        }

        options={
          mappedClientOptions
        }

        onChange={(e)=>
          setFormData(
            (prev)=>({
              ...prev,

              clientUuid:
                e.target.value,
            }),
          )
        }

      />




      {/* Project Category */}

      <Select

        label="Project Category"

        value={
          formData.categoryUuid
        }

        options={
          mappedCategoryOptions
        }

        onChange={(e)=>
          setFormData(
            (prev)=>({
              ...prev,

              categoryUuid:
                e.target.value,
            }),
          )
        }

      />




      {/* Branch */}

      <Select

        label="Branch"

        value={
          formData.organizationUnitUuid
        }

        options={
          mappedBranchOptions
        }

        onChange={(e)=>
          setFormData(
            (prev)=>({
              ...prev,

              organizationUnitUuid:
                e.target.value,
            }),
          )
        }

      />




      {/* Project Name */}

      <Input

        label="Project Name"

        value={
          formData.name
        }

        onChange={(e)=>
          setFormData(
            (prev)=>({
              ...prev,

              name:
                e.target.value,
            }),
          )
        }

      />




      {/* Location */}

      <Select

        label="State"

        value={
          formData.stateUuid ?? ""
        }

        options={
          mappedStateOptions
        }

        onChange={async(e)=>{

          const stateUuid =
            e.target.value;


          setFormData(
            (prev)=>({
              ...prev,

              stateUuid,

              cityUuid:"",
            }),
          );


          await onStateChange(
            stateUuid,
          );

        }}

      />



      <Select

        label="City"

        value={
          formData.cityUuid ?? ""
        }

        options={
          mappedCityOptions
        }

        onChange={(e)=>
          setFormData(
            (prev)=>({
              ...prev,

              cityUuid:
                e.target.value,
            }),
          )
        }

      />




      <Input

        label="Pincode"

        value={
          formData.pincode ?? ""
        }

        onChange={(e)=>
          setFormData(
            (prev)=>({
              ...prev,

              pincode:
                e.target.value,
            }),
          )
        }

      />




      <Input

        label="Address"

        value={
          formData.address ?? ""
        }

        onChange={(e)=>
          setFormData(
            (prev)=>({
              ...prev,

              address:
                e.target.value,
            }),
          )
        }

      />




      {/* Timeline */}

      <Input

        type="date"

        label="Start Date"

        value={
          formData.startDate ?? ""
        }

        onChange={(e)=>
          setFormData(
            (prev)=>({
              ...prev,

              startDate:
                e.target.value,
            }),
          )
        }

      />



      <Input

        type="date"

        label="Expected End Date"

        value={
          formData.expectedEndDate ?? ""
        }

        onChange={(e)=>
          setFormData(
            (prev)=>({
              ...prev,

              expectedEndDate:
                e.target.value,
            }),
          )
        }

      />




      {/* Remarks */}

      <Input

        label="Remarks"

        value={
          formData.remarks ?? ""
        }

        onChange={(e)=>
          setFormData(
            (prev)=>({
              ...prev,

              remarks:
                e.target.value,
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
              label:"Active",
              value:"ACTIVE",
            },

            {
              label:"Inactive",
              value:"INACTIVE",
            },
          ]}

          onChange={(e)=>
            setFormData(
              (prev)=>({
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


export default ProjectForm;