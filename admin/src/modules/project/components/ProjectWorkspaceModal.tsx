import {
  useEffect,
  useState,
} from "react";

import Modal from "@/shared/components/Modal";

import ProjectMembersPanel from "./project-member/ProjectMembersPanel";
import ProjectTasksPanel from "./project-task/ProjectTasksPanel";

import {
  useProjectMembers,
} from "../hooks/useProjectMembers";

import type {
  Project,
} from "../types/project.types";

interface EmployeeOption {
  uuid: string;
  label: string;
}

interface ProjectRoleOption {
  uuid: string;
  name: string;
  status:
    | "ACTIVE"
    | "INACTIVE";
}

interface Props {
  open: boolean;

  project:
    | Project
    | null;

  employees:
    EmployeeOption[];

  projectRoles:
    ProjectRoleOption[];

  loadingProject?: boolean;
  loadingEmployees?: boolean;
  loadingRoles?: boolean;

  onClose: () => void;
}

type WorkspaceTab =
  | "overview"
  | "members"
  | "tasks";

const ProjectWorkspaceModal = ({
  open,
  project,

  employees,
  projectRoles,

  loadingProject = false,
  loadingEmployees = false,
  loadingRoles = false,

  onClose,
}: Props) => {
  const [
    activeTab,
    setActiveTab,
  ] =
    useState<WorkspaceTab>(
      "overview",
    );

  const {
    projectMembers,
    fetchProjectMembers,
    loading:
      loadingMembers,
  } = useProjectMembers();

  useEffect(() => {
    if (
      !open ||
      !project
    ) {
      return;
    }

    setActiveTab(
      "overview",
    );

    void fetchProjectMembers(
      project.uuid,
    );
  }, [
    open,
    project?.uuid,
    fetchProjectMembers,
  ]);

  const taskMemberOptions =
    projectMembers
      .filter(
        (member) =>
          member.isActive,
      )
      .map((member) => {
        const employee =
          member.employee;

        const fullName = [
          employee.firstName,
          employee.lastName,
        ]
          .filter(Boolean)
          .join(" ");

        const employeeName =
          employee.displayName ||
          fullName ||
          employee.employeeCode ||
          "-";

        return {
          uuid:
            member.uuid,

          label:
            `${employeeName} - ${member.projectRole.name}`,
        };
      });

  const handleClose = () => {
    setActiveTab(
      "overview",
    );

    onClose();
  };

  return (
    <Modal
      open={open}
      title={
        project
          ? `Project - ${project.name}`
          : "Project Workspace"
      }
      onClose={
        handleClose
      }
      size="lg"
    >
      {loadingProject ? (
        <p>
          Loading project...
        </p>
      ) : !project ? (
        <p>
          No project found.
        </p>
      ) : (
        <>
          {/* Project Summary */}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems:
                "center",
              gap: 8,
              marginBottom: 20,
              color: "#6b7280",
              fontSize: 13,
            }}
          >
            <span>
              {project.srn}
            </span>

            <span>
              •
            </span>

            <span>
              {project.client
                ?.name ?? "-"}
            </span>

            <span>
              •
            </span>

            <span>
              {project.status}
            </span>
          </div>

          {/* Tabs */}

          <div
            style={{
              display: "flex",
              gap: 4,
              marginBottom: 20,
              borderBottom:
                "1px solid #e5e7eb",
            }}
          >
            {(
              [
                [
                  "overview",
                  "Overview",
                ],
                [
                  "members",
                  `Members (${projectMembers.filter(
                    (member) =>
                      member.isActive,
                  ).length})`,
                ],
                [
                  "tasks",
                  "Tasks",
                ],
              ] as const
            ).map(
              ([
                value,
                label,
              ]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      value,
                    )
                  }
                  style={{
                    padding:
                      "10px 14px",

                    border:
                      "none",

                    borderBottom:
                      activeTab ===
                      value
                        ? "2px solid #2563eb"
                        : "2px solid transparent",

                    background:
                      "transparent",

                    color:
                      activeTab ===
                      value
                        ? "#111827"
                        : "#6b7280",

                    fontWeight:
                      activeTab ===
                      value
                        ? 700
                        : 500,

                    cursor:
                      "pointer",
                  }}
                >
                  {label}
                </button>
              ),
            )}
          </div>

          {/* Stable Workspace Content */}

          <div
            style={{
              minHeight:
                "420px",

              maxHeight:
                "65vh",

              overflowY:
                "auto",

              overflowX:
                "hidden",

              padding:
                "4px 4px 8px 2px",
            }}
          >
            {/* Overview */}

          {activeTab ===
  "overview" && (
  <div
    style={{
      display: "grid",
      gap: 24,
    }}
  >
    {/* Key Information */}

    <section>
      <div
        style={{
          marginBottom: 12,
          fontSize: 12,
          fontWeight: 700,
          color: "#6b7280",
          textTransform:
            "uppercase",
          letterSpacing:
            "0.06em",
        }}
      >
        Project Information
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        {[
          {
            label: "Client",
            value:
              project.client
                ?.name ?? "-",
          },

          {
            label: "Category",
            value:
              project.category
                ?.name ?? "-",
          },

          {
            label: "Branch",
            value:
              project
                .organizationUnit
                ?.name ?? "-",
          },

          {
            label: "Location",
            value:
              [
                project.city
                  ?.name,
                project.state
                  ?.name,
              ]
                .filter(Boolean)
                .join(", ") ||
              "-",
          },
        ].map(
          (item) => (
            <div
              key={
                item.label
              }
              style={{
                padding:
                  "16px 18px",

                border:
                  "1px solid #e5e7eb",

                borderRadius:
                  10,

                background:
                  "#f9fafb",
              }}
            >
              <div
                style={{
                  marginBottom:
                    6,

                  fontSize: 12,

                  color:
                    "#6b7280",

                  fontWeight:
                    500,
                }}
              >
                {
                  item.label
                }
              </div>

              <div
                style={{
                  fontSize: 14,

                  fontWeight:
                    700,

                  color:
                    "#111827",

                  lineHeight:
                    1.4,
                }}
              >
                {
                  item.value
                }
              </div>
            </div>
          ),
        )}
      </div>
    </section>

    {/* Timeline */}

    <section>
      <div
        style={{
          marginBottom: 12,
          fontSize: 12,
          fontWeight: 700,
          color: "#6b7280",
          textTransform:
            "uppercase",
          letterSpacing:
            "0.06em",
        }}
      >
        Timeline
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        <div
          style={{
            padding:
              "16px 18px",

            border:
              "1px solid #e5e7eb",

            borderRadius: 10,
          }}
        >
          <div
            style={{
              marginBottom: 6,
              fontSize: 12,
              color:
                "#6b7280",
            }}
          >
            Start Date
          </div>

          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color:
                "#111827",
            }}
          >
            {project.startDate
              ? new Date(
                  project.startDate,
                ).toLocaleDateString(
                  "en-IN",
                  {
                    day:
                      "2-digit",
                    month:
                      "short",
                    year:
                      "numeric",
                  },
                )
              : "-"}
          </div>
        </div>

        <div
          style={{
            padding:
              "16px 18px",

            border:
              "1px solid #e5e7eb",

            borderRadius: 10,
          }}
        >
          <div
            style={{
              marginBottom: 6,
              fontSize: 12,
              color:
                "#6b7280",
            }}
          >
            Expected End
          </div>

          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color:
                "#111827",
            }}
          >
            {project.expectedEndDate
              ? new Date(
                  project.expectedEndDate,
                ).toLocaleDateString(
                  "en-IN",
                  {
                    day:
                      "2-digit",
                    month:
                      "short",
                    year:
                      "numeric",
                  },
                )
              : "-"}
          </div>
        </div>
      </div>
    </section>

    {/* Remarks */}

    <section>
      <div
        style={{
          marginBottom: 12,
          fontSize: 12,
          fontWeight: 700,
          color: "#6b7280",
          textTransform:
            "uppercase",
          letterSpacing:
            "0.06em",
        }}
      >
        Remarks
      </div>

      <div
        style={{
          padding:
            "16px 18px",

          border:
            "1px solid #e5e7eb",

          borderRadius: 10,

          background:
            "#fff",

          fontSize: 14,

          lineHeight: 1.6,

          color:
            "#374151",
        }}
      >
        {project.remarks ||
          "No remarks added for this project."}
      </div>
    </section>
  </div>
)}

            {/* Members */}

            {activeTab ===
              "members" && (
              <ProjectMembersPanel
                projectUuid={
                  project.uuid
                }
                employees={
                  employees
                }
                projectRoles={
                  projectRoles
                }
                loadingEmployees={
                  loadingEmployees
                }
                loadingRoles={
                  loadingRoles
                }
                onMembersChange={() => {
                  void fetchProjectMembers(
                    project.uuid,
                  );
                }}
              />
            )}

            {/* Tasks */}

            {activeTab ===
              "tasks" && (
              <ProjectTasksPanel
                projectUuid={
                  project.uuid
                }
                projectMembers={
                  taskMemberOptions
                }
                loadingMembers={
                  loadingMembers
                }
              />
            )}
          </div>
        </>
      )}
    </Modal>
  );
};

export default ProjectWorkspaceModal;