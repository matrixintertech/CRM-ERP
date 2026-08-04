import Badge from "@/shared/components/Badge";
import Modal from "@/shared/components/Modal";

import type {
  Project,
} from "../types/project.types";


interface Props {
  open: boolean;
  loading: boolean;
  project: Project | null;
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



const ProjectDetailsModal = ({
  open,
  loading,
  project,
  onClose,
}: Props) => {

  return (

    <Modal
      open={open}
      title="Project Details"
      onClose={onClose}
      size="lg"
    >

      {loading ? (

        <p>
          Loading...
        </p>


      ) : !project ? (

        <p>
          No project found.
        </p>


      ) : (

        <div
          style={{
            display:"grid",
            gap:28,
          }}
        >


          {/* General Information */}

          <section>

            <h3
              style={{
                marginBottom:16,
                paddingBottom:8,
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >
              General Information
            </h3>


            <div
              style={{
                display:"grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap:20,
              }}
            >

              <DetailItem
                label="Project Name"
                value={
                  project.name
                }
              />


              <DetailItem
                label="SRN"
                value={
                  project.srn
                }
              />


              <DetailItem
                label="Client"
                value={
                  project.client?.name
                }
              />


              <DetailItem
                label="Category"
                value={
                  project.category?.name
                }
              />


              <DetailItem
                label="Branch"
                value={
                  project.organizationUnit?.name
                }
              />


              <DetailItem
                label="Status"
                value={
                  <Badge
                    status={
                      project.status
                    }
                  />
                }
              />

            </div>

          </section>





          {/* Address Information */}

          <section>

            <h3
              style={{
                marginBottom:16,
                paddingBottom:8,
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >
              Address Information
            </h3>


            <div
              style={{
                display:"grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap:20,
              }}
            >

              <DetailItem
                label="State"
                value={
                  project.state?.name
                }
              />


              <DetailItem
                label="City"
                value={
                  project.city?.name
                }
              />


              <DetailItem
                label="Pincode"
                value={
                  project.pincode
                }
              />


              <DetailItem
                label="Address"
                value={
                  project.address
                }
              />

            </div>

          </section>





          {/* Timeline */}

          <section>

            <h3
              style={{
                marginBottom:16,
                paddingBottom:8,
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >
              Timeline
            </h3>


            <div
              style={{
                display:"grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap:20,
              }}
            >

              <DetailItem
                label="Start Date"
                value={
                  project.startDate
                    ? new Date(
                        project.startDate,
                      ).toLocaleDateString(
                        "en-IN",
                      )
                    : "-"
                }
              />


              <DetailItem
                label="Expected End Date"
                value={
                  project.expectedEndDate
                    ? new Date(
                        project.expectedEndDate,
                      ).toLocaleDateString(
                        "en-IN",
                      )
                    : "-"
                }
              />

            </div>

          </section>





          {/* Remarks */}

          <section>

            <h3
              style={{
                marginBottom:16,
                paddingBottom:8,
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >
              Remarks
            </h3>


            <DetailItem
              label="Remarks"
              value={
                project.remarks
              }
            />

          </section>





          {/* Audit */}

          <section>

            <h3
              style={{
                marginBottom:16,
                paddingBottom:8,
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >
              Audit Information
            </h3>


            <div
              style={{
                display:"grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap:20,
              }}
            >

              <DetailItem
                label="Created At"
                value={
                  new Date(
                    project.createdAt,
                  ).toLocaleString(
                    "en-IN",
                  )
                }
              />


              <DetailItem
                label="Updated At"
                value={
                  new Date(
                    project.updatedAt,
                  ).toLocaleString(
                    "en-IN",
                  )
                }
              />

            </div>

          </section>


        </div>

      )}

    </Modal>

  );
};


export default ProjectDetailsModal;