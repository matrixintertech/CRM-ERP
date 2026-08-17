import type {
  Dispatch,
  SetStateAction,
} from "react";

import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import type {
  ProjectTaskFormData,
  TaskPriority,
} from "../../types/project-task.types";


interface ProjectMemberOption {
  uuid: string;
  label: string;
}


interface Props {
  formData: ProjectTaskFormData;

  setFormData: Dispatch<
    SetStateAction<ProjectTaskFormData>
  >;

  projectMembers:
    ProjectMemberOption[];

  isEdit?: boolean;

  loadingMembers?: boolean;
}


const ProjectTaskForm = ({
  formData,
  setFormData,

  projectMembers,

  loadingMembers = false,
}: Props) => {
  const memberOptions = [
    {
      label: loadingMembers
        ? "Loading members..."
        : "Unassigned",

      value: "",
    },

    ...projectMembers.map(
      (member) => ({
        label:
          member.label,

        value:
          member.uuid,
      }),
    ),
  ];


  return (
    <div
      style={{
        display: "grid",
        gap: 18,
      }}
    >
      <Input
        label="Task Title"
        value={
          formData.title
        }
        placeholder="Enter task title"
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              title:
                event.target.value,
            }),
          )
        }
      />


      <Input
        label="Description"
        value={
          formData.description
        }
        placeholder="Enter task description"
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              description:
                event.target.value,
            }),
          )
        }
      />


      <Select
        label="Assign To"
        value={
          formData
            .assignedProjectMemberUuid
        }
        options={
          memberOptions
        }
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              assignedProjectMemberUuid:
                event.target.value,
            }),
          )
        }
      />


      <Select
        label="Priority"
        value={
          formData.priority
        }
        options={[
          {
            label: "Low",
            value: "LOW",
          },

          {
            label: "Medium",
            value: "MEDIUM",
          },

          {
            label: "High",
            value: "HIGH",
          },

          {
            label: "Urgent",
            value: "URGENT",
          },
        ]}
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              priority:
                event.target
                  .value as TaskPriority,
            }),
          )
        }
      />


      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "1fr 1fr",

          gap: 16,
        }}
      >
        <Input
          type="date"
          label="Start Date"
          value={
            formData.startDate
          }
          onChange={(event) =>
            setFormData(
              (previous) => ({
                ...previous,

                startDate:
                  event.target.value,
              }),
            )
          }
        />

        <Input
          type="date"
          label="Due Date"
          value={
            formData.dueDate
          }
          onChange={(event) =>
            setFormData(
              (previous) => ({
                ...previous,

                dueDate:
                  event.target.value,
              }),
            )
          }
        />
      </div>


      <Input
        label="Remarks"
        value={
          formData.remarks
        }
        placeholder="Enter remarks"
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              remarks:
                event.target.value,
            }),
          )
        }
      />


      <Input
        type="number"
        label="Sort Order"
        value={String(
          formData.sortOrder ??
            0,
        )}
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              sortOrder:
                Number(
                  event.target.value,
                ),
            }),
          )
        }
      />
    </div>
  );
};


export default ProjectTaskForm;