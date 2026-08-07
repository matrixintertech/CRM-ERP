import {
  useEffect,
  useState,
} from "react";

import {
  useDocumentTitle,
} from "@/shared/hooks/useDocumentTitle";

import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";
import PageHeader from "@/shared/components/PageHeader";

import ProjectDetailsModal from "../components/ProjectDetailsModal";
import ProjectModal from "../components/ProjectModal";
import ProjectTable from "../components/ProjectTable";
import ProjectMembersModal from "../components/ProjectMemberModal";

import {
  useProjects,
} from "../hooks/useProjects";

import {
  useClients,
} from "../../client/hooks/useClients";

import {
  useStates,
} from "../../master/state/hooks/useStates";

import {
  useCities,
} from "../../master/city/hooks/useCities";

import {
  useProjectCategories,
} from "../../project-category/hooks/useProjectCategory";

import {
  useOrganizationUnits,
} from "../../organization-unit/hooks/useOrganizationUnits";

import {
  useEmployee,
} from "../../employee/hooks/useEmployee";

import {
  useProjectRoles,
} from "../../project-role/hooks/useProjectRoles";

import type {
  CreateProjectRequest,
  ProjectFormData,
  UpdateProjectRequest,
} from "../types/project.types";

const initialFormData: ProjectFormData = {
  clientUuid: "",
  categoryUuid: "",
  organizationUnitUuid: "",

  name: "",

  stateUuid: "",
  cityUuid: "",

  address: "",
  pincode: "",

  startDate: "",
  expectedEndDate: "",

  remarks: "",

  status: "ACTIVE",
};

const ProjectListPage = () => {
  useDocumentTitle(
    "All Projects",
  );

  const {
    loading,
    projects,
    selectedProject,

    fetchProjects,
    fetchProject,

    create,
    update,
    remove,

    clearSelectedProject,
  } = useProjects();

  const {
    dropdown:
      clientDropdown,

    fetchDropdown:
      fetchClientDropdown,
  } = useClients();

  const {
    dropdown:
      stateDropdown,

    fetchDropdown:
      fetchStateDropdown,
  } = useStates();

  const {
    dropdownCities:
      cityDropdown,

    fetchDropdownCities:
      fetchCityDropdown,
  } = useCities();

  const {
    categories,
    fetchCategories,
  } = useProjectCategories();

  const {
    organizationUnits,
    fetchOrganizationUnits,
  } =
    useOrganizationUnits();

  const {
    employees,
    fetchEmployees,
    loading:
      loadingEmployees,
  } = useEmployee();

  const {
    projectRoles,
    fetchProjectRoles,
    loading:
      loadingRoles,
  } = useProjectRoles();

  const [
    openModal,
    setOpenModal,
  ] = useState(false);

  const [
    openDetails,
    setOpenDetails,
  ] = useState(false);

  const [
    openMembers,
    setOpenMembers,
  ] = useState(false);

  const [
    memberProjectUuid,
    setMemberProjectUuid,
  ] = useState<
    string | null
  >(null);

  const [
    memberProjectName,
    setMemberProjectName,
  ] = useState("");

  const [
    editId,
    setEditId,
  ] = useState<
    string | null
  >(null);

  const [
    formData,
    setFormData,
  ] = useState(() => ({
    ...initialFormData,
  }));

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  const resetForm = () => {
    setEditId(null);

    setFormData({
      ...initialFormData,
    });
  };

  const loadFormDropdowns =
    async () => {
      await Promise.all([
        fetchClientDropdown(),
        fetchStateDropdown(),
        fetchCategories(),
        fetchOrganizationUnits(),
      ]);
    };

  const handleOpenCreateModal =
    async () => {
      try {
        await loadFormDropdowns();

        resetForm();

        setOpenModal(true);
      } catch (error) {
        console.error(
          "Failed to prepare project form:",
          error,
        );
      }
    };

  const handleCloseModal =
    () => {
      setOpenModal(false);

      resetForm();
    };

  const handleCloseDetails =
    () => {
      setOpenDetails(false);

      clearSelectedProject();
    };

  const handleCloseMembers =
    () => {
      setOpenMembers(false);

      setMemberProjectUuid(
        null,
      );

      setMemberProjectName("");
    };

  const handleStateChange =
    async (
      stateUuid: string,
    ) => {
      setFormData(
        (previous) => ({
          ...previous,
          stateUuid,
          cityUuid: "",
        }),
      );

      if (!stateUuid) {
        return;
      }

      try {
        await fetchCityDropdown(
          stateUuid,
        );
      } catch (error) {
        console.error(
          "Failed to load cities:",
          error,
        );
      }
    };

  const getCreatePayload =
    (): CreateProjectRequest => ({
      clientUuid:
        formData.clientUuid,

      categoryUuid:
        formData.categoryUuid,

      organizationUnitUuid:
        formData.organizationUnitUuid,

      name:
        formData.name.trim(),

      stateUuid:
        formData.stateUuid ||
        undefined,

      cityUuid:
        formData.cityUuid ||
        undefined,

      address:
        formData.address
          ?.trim() ||
        undefined,

      pincode:
        formData.pincode
          ?.trim() ||
        undefined,

      startDate:
        formData.startDate ||
        undefined,

      expectedEndDate:
        formData.expectedEndDate ||
        undefined,

      remarks:
        formData.remarks
          ?.trim() ||
        undefined,
    });

  const handleSubmit =
    async () => {
      try {
        const basePayload =
          getCreatePayload();

        if (editId) {
          const payload:
            UpdateProjectRequest = {
            ...basePayload,

            status:
              formData.status,
          };

          await update(
            editId,
            payload,
          );
        } else {
          await create(
            basePayload,
          );
        }

        await fetchProjects();

        handleCloseModal();
      } catch (error) {
        console.error(
          "Failed to save project:",
          error,
        );
      }
    };

  const handleEdit =
    async (
      uuid: string,
    ) => {
      try {
        await loadFormDropdowns();

        const project =
          await fetchProject(
            uuid,
          );

        if (
          project.state?.uuid
        ) {
          await fetchCityDropdown(
            project.state.uuid,
          );
        }

        setEditId(uuid);

        setFormData({
          clientUuid:
            project.client
              ?.uuid ?? "",

          categoryUuid:
            project.category
              ?.uuid ?? "",

          organizationUnitUuid:
            project.organizationUnit
              ?.uuid ?? "",

          name:
            project.name,

          stateUuid:
            project.state?.uuid ??
            "",

          cityUuid:
            project.city?.uuid ??
            "",

          address:
            project.address ?? "",

          pincode:
            project.pincode ?? "",

          startDate:
            project.startDate
              ?.slice(
                0,
                10,
              ) ?? "",

          expectedEndDate:
            project.expectedEndDate
              ?.slice(
                0,
                10,
              ) ?? "",

          remarks:
            project.remarks ?? "",

          status:
            project.status,
        });

        setOpenModal(true);
      } catch (error) {
        console.error(
          "Failed to load project:",
          error,
        );
      }
    };

  const handleView =
    async (
      uuid: string,
    ) => {
      try {
        clearSelectedProject();

        setOpenDetails(true);

        await fetchProject(
          uuid,
        );
      } catch (error) {
        console.error(
          "Failed to load project details:",
          error,
        );

        setOpenDetails(false);
      }
    };

  const handleMembers =
    async (
      uuid: string,
    ) => {
      try {
        const project =
          projects.find(
            (item) =>
              item.uuid ===
              uuid,
          );

        setMemberProjectUuid(
          uuid,
        );

        setMemberProjectName(
          project?.name ?? "",
        );

        await Promise.all([
          fetchEmployees(),
          fetchProjectRoles(),
        ]);

        setOpenMembers(true);
      } catch (error) {
        console.error(
          "Failed to prepare project members:",
          error,
        );
      }
    };

  const handleDelete =
    async (
      uuid: string,
    ) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this project?",
        );

      if (!confirmed) {
        return;
      }

      try {
        await remove(uuid);
      } catch (error) {
        console.error(
          "Failed to delete project:",
          error,
        );
      }
    };

  const clientOptions =
    clientDropdown.map(
      (item) => ({
        label: item.name,
        value: item.uuid,
      }),
    );

  const categoryOptions =
    categories.map(
      (item) => ({
        label: item.name,
        value: item.uuid,
      }),
    );

  const branchOptions =
    organizationUnits
      .filter(
        (item) =>
          item.status ===
          "ACTIVE",
      )
      .map((item) => ({
        label:
          `${item.name} (${item.code})`,

        value:
          item.uuid,
      }));

  const stateOptions =
    stateDropdown.map(
      (item) => ({
        label: item.name,
        value: item.uuid,
      }),
    );

  const cityOptions =
    cityDropdown.map(
      (item) => ({
        label: item.name,
        value: item.uuid,
      }),
    );

 const employeeOptions =
  employees
    .filter(
      (employee) =>
        employee.status ===
        "ACTIVE",
    )
    .map((employee) => {
      const fullName = [
        employee.firstName,
        employee.lastName,
      ]
        .filter(Boolean)
        .join(" ");

      return {
        uuid: employee.uuid,

        label:
          employee.displayName ||
          fullName ||
          employee.employeeCode ||
          "-",
      };
    });


  const projectRoleOptions =
    projectRoles.map(
      (role) => ({
        uuid:
          role.uuid,

        name:
          role.name,

        status:
          role.status,
      }),
    );

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle="Manage company projects"
        actions={
          <Button
            onClick={
              handleOpenCreateModal
            }
          >
            Create Project
          </Button>
        }
      />

      <Card>
        <ProjectTable
          data={projects}
          loading={loading}
          onView={handleView}
          onMembers={
            handleMembers
          }
          onEdit={handleEdit}
          onDelete={
            handleDelete
          }
        />
      </Card>

      <ProjectModal
        open={openModal}
        loading={loading}
        title={
          editId
            ? "Edit Project"
            : "Create Project"
        }
        isEdit={
          Boolean(editId)
        }
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
          handleStateChange
        }
        onClose={
          handleCloseModal
        }
        onSubmit={
          handleSubmit
        }
      />

      <ProjectDetailsModal
        open={openDetails}
        loading={loading}
        project={
          selectedProject
        }
        onClose={
          handleCloseDetails
        }
      />

      <ProjectMembersModal
        open={openMembers}
        projectUuid={
          memberProjectUuid
        }
        projectName={
          memberProjectName
        }
        employees={
          employeeOptions
        }
        projectRoles={
          projectRoleOptions
        }
        loadingEmployees={
          loadingEmployees
        }
        loadingRoles={
          loadingRoles
        }
        onClose={
          handleCloseMembers
        }
      />
    </>
  );
};

export default ProjectListPage;