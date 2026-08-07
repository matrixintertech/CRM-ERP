import type {
  ReactNode,
} from "react";

import Badge from "@/shared/components/Badge";
import Modal from "@/shared/components/Modal";

import type {
  ProjectRole,
} from "../types/project-role.types";

interface Props {
  open: boolean;

  loading: boolean;

  projectRole:
    | ProjectRole
    | null;

  onClose: () => void;
}

interface DetailItemProps {
  label: string;

  value?: ReactNode;
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
      {value !== null &&
      value !== undefined &&
      value !== ""
        ? value
        : "-"}
    </div>
  </div>
);

const ProjectRoleDetailsModal = ({
  open,
  loading,
  projectRole,
  onClose,
}: Props) => {
  return (
    <Modal
      open={open}
      title="Project Role Details"
      onClose={onClose}
      size="md"
    >
      {loading ? (
        <p>
          Loading...
        </p>
      ) : !projectRole ? (
        <p>
          No project role found.
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
                label="Role Name"
                value={
                  projectRole.name
                }
              />

              <DetailItem
                label="Code"
                value={
                  projectRole.code
                }
              />

              <DetailItem
                label="Status"
                value={
                  <Badge
                    status={
                      projectRole.status
                    }
                  />
                }
              />

              <DetailItem
                label="Sort Order"
                value={
                  projectRole.sortOrder
                }
              />
            </div>
          </section>

          {/* Assignment Rule */}

          <section>
            <h3
              style={{
                marginBottom: 16,
                paddingBottom: 8,
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >
              Assignment Rule
            </h3>

            <DetailItem
              label="Assignment Type"
              value={
                projectRole.isSingleAssignee
                  ? "Single Assignee"
                  : "Multiple Assignees"
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
                projectRole.description
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
                    projectRole.createdAt,
                  ).toLocaleString()
                }
              />

              <DetailItem
                label="Updated At"
                value={
                  new Date(
                    projectRole.updatedAt,
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

export default ProjectRoleDetailsModal;