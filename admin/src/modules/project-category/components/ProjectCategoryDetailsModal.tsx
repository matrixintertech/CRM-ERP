import Badge from "@/shared/components/Badge";
import Modal from "@/shared/components/Modal";

import type {
  ProjectCategory,
} from "../types/project-category.types";


interface Props {
  open: boolean;

  loading: boolean;

  category:
    | ProjectCategory
    | null;

  onClose: () => void;
}


interface DetailItemProps {
  label: string;

  value?: React.ReactNode;
}


const DetailItem = ({
  label,
  value,
}: DetailItemProps) => (
  <div>

    <div
      style={{
        fontSize: 12,
        color: "#6b7280",
        fontWeight: 500,
        marginBottom: 4,
      }}
    >
      {label}
    </div>


    <div
      style={{
        fontSize: 14,
        fontWeight: 600,
        color: "#111827",
      }}
    >
      {value || "-"}
    </div>

  </div>
);



const ProjectCategoryDetailsModal = ({
  open,
  loading,
  category,
  onClose,
}: Props) => {

  return (

    <Modal
      open={open}
      title="Project Category Details"
      onClose={onClose}
      size="md"
    >

      {loading ? (

        <p>
          Loading...
        </p>


      ) : !category ? (

        <p>
          No category found.
        </p>


      ) : (

        <div
          style={{
            display: "grid",
            gap: 28,
          }}
        >


          {/* General Information */}

          <section>

            <h3
              style={{
                marginBottom: 16,
                paddingBottom: 8,
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >
              General Information
            </h3>


            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 20,
              }}
            >

              <DetailItem
                label="Category Name"
                value={
                  category.name
                }
              />


              <DetailItem
                label="Code"
                value={
                  category.code
                }
              />


              <DetailItem
                label="Status"
                value={
                  <Badge
                    status={
                      category.status
                    }
                  />
                }
              />


              <DetailItem
                label="Sort Order"
                value={
                  category.sortOrder
                }
              />

            </div>

          </section>





          {/* Appearance */}

          <section>

            <h3
              style={{
                marginBottom: 16,
                paddingBottom: 8,
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >
              Appearance
            </h3>


            <DetailItem
              label="Color"
              value={

                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap: 10,
                  }}
                >

                  <span
                    style={{
                      width: 20,

                      height: 20,

                      borderRadius:
                        "50%",

                      backgroundColor:
                        category.color ||
                        "#D1D5DB",

                      border:
                        "1px solid #ccc",
                    }}
                  />


                  <span>
                    {
                      category.color ||
                      "-"
                    }
                  </span>

                </div>

              }
            />

          </section>





          {/* Description */}

          <section>

            <h3
              style={{
                marginBottom: 16,
                paddingBottom: 8,
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >
              Description
            </h3>


            <DetailItem
              label="Description"
              value={
                category.description
              }
            />

          </section>





          {/* Audit Information */}

          <section>

            <h3
              style={{
                marginBottom: 16,
                paddingBottom: 8,
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >
              Audit Information
            </h3>


            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 20,
              }}
            >

              <DetailItem
                label="Created At"
                value={
                  new Date(
                    category.createdAt,
                  ).toLocaleString()
                }
              />


              <DetailItem
                label="Updated At"
                value={
                  new Date(
                    category.updatedAt,
                  ).toLocaleString()
                }
              />

            </div>

          </section>


        </div>

      )}

    </Modal>

  );
};


export default ProjectCategoryDetailsModal;