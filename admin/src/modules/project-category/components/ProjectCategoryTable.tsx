import Badge from "@/shared/components/Badge";
import Button from "@/shared/components/Button";
import Table, {
  type Column,
} from "@/shared/components/Table";

import type {
  ProjectCategory,
} from "../types/project-category.types";


interface Props {
  data: ProjectCategory[];

  loading: boolean;

  onView: (
    uuid: string,
  ) => void;

  onEdit: (
    uuid: string,
  ) => void;

  onDelete: (
    uuid: string,
  ) => void;
}


const ProjectCategoryTable = ({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
}: Props) => {


  const columns:
    Column<ProjectCategory>[] = [

    {
      key: "name",

      title:
        "Category Name",
    },


    {
      key: "code",

      title:
        "Code",
    },


    {
      key: "description",

      title:
        "Description",

      render: (
        value,
      ) =>
        value || "-",
    },


    {
      key: "color",

      title:
        "Color",

      render: (
        value,
      ) => (

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              8,
          }}
        >

          <span
            style={{
              width:
                18,

              height:
                18,

              borderRadius:
                "50%",

              backgroundColor:
                String(
                  value ||
                  "#D1D5DB",
                ),

              border:
                "1px solid #ccc",
            }}
          />

          <span>
            {
              value || "-"
            }
          </span>

        </div>

      ),
    },


    {
      key: "sortOrder",

      title:
        "Sort Order",
    },


    {
      key: "status",

      title:
        "Status",

      render: (
        value,
      ) => (
        <Badge
          status={
            String(value)
          }
        />
      ),
    },


    {
      key: "action",

      title:
        "Action",

      render: (
        _,
        row,
      ) => (

        <div
          style={{
            display:
              "flex",

            gap:
              8,
          }}
        >

          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              onView(
                row.uuid,
              )
            }
          >
            View
          </Button>


          <Button
            size="sm"
            onClick={() =>
              onEdit(
                row.uuid,
              )
            }
          >
            Edit
          </Button>


          <Button
            size="sm"
            variant="danger"
            onClick={() =>
              onDelete(
                row.uuid,
              )
            }
          >
            Delete
          </Button>

        </div>

      ),
    },

  ];


  return (

    <Table
      columns={
        columns
      }

      data={
        data
      }

      loading={
        loading
      }

    />

  );
};


export default ProjectCategoryTable;