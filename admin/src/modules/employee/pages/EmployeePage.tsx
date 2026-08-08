import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Eye,
  ShieldCheck,
  SquarePen,
  Trash2,
  UserPlus,
} from "lucide-react";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";
import DataTable from "@/shared/components/DataTable/DataTable";

import type {
  DataTableColumn,
} from "@/shared/components/DataTable/types";

import EmployeeModal from "../components/EmployeeModal";
import EmployeeDetailsModal from "../components/EmployeeDetailsModal";
import EmployeeUserAccountModal from "../components/EmployeeUserAccountModal";

import {
  useEmployee,
} from "../hooks/useEmployee";

import {
  useOrganizationUnits,
} from "../../organization-unit/hooks/useOrganizationUnits";

import {
  useDepartment,
} from "../../department/hooks/useDepartment";

import {
  useDesignation,
} from "../../designation/hooks/useDesignation";

import {
  useRole,
} from "../../role/hooks/useRoles";

import type {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "../types/employee.types";

const createDefaultForm =
  (): CreateEmployeeDto => ({
    firstName: "",
    lastName: "",
    displayName: "",

    email: "",
    mobile: "",

    gender: undefined,

    organizationUnitUuid: "",
    departmentUuid: "",
    designationUuid: "",
    managerUuid: "",

    joiningDate: "",
    employmentType: undefined,

    avatarUrl: "",

    status: "ACTIVE",
  });

const EmployeePage = () => {
  const navigate =
    useNavigate();

  const {
    loading,
    employees,

    fetchEmployee,

    create,
    update,
    remove,

    saving,

    refetch:
      refetchEmployees,
  } = useEmployee();

  const {
    organizationUnits,
    fetchOrganizationUnits,
  } = useOrganizationUnits();

  const {
    departments,
  } = useDepartment();

  const {
    designations,
  } = useDesignation();

  const {
    roles,
    fetchRoles,
  } = useRole();

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    editUuid,
    setEditUuid,
  ] = useState<
    string | null
  >(null);

  const [
    formData,
    setFormData,
  ] =
    useState<CreateEmployeeDto>(
      createDefaultForm,
    );

  const [
    viewOpen,
    setViewOpen,
  ] = useState(false);

  const [
    selectedEmployee,
    setSelectedEmployee,
  ] = useState<
    Employee | null
  >(null);

  const [
    accountModalOpen,
    setAccountModalOpen,
  ] = useState(false);

  const [
    accountEmployee,
    setAccountEmployee,
  ] = useState<
    Employee | null
  >(null);

  useEffect(() => {
    void Promise.all([
      fetchOrganizationUnits(),
      fetchRoles(),
    ]);
  }, [
    fetchOrganizationUnits,
    fetchRoles,
  ]);

  const resetForm =
    useCallback(() => {
      setEditUuid(
        null,
      );

      setFormData(
        createDefaultForm(),
      );
    }, []);

  const handleOpenCreate =
    () => {
      resetForm();

      setOpen(
        true,
      );
    };

  const handleClose =
    () => {
      setOpen(
        false,
      );

      resetForm();
    };

  const handleOpenAccount = (
    employee: Employee,
  ) => {
    setAccountEmployee(
      employee,
    );

    setAccountModalOpen(
      true,
    );
  };

  const handleCloseAccount =
    () => {
      setAccountModalOpen(
        false,
      );

      setAccountEmployee(
        null,
      );
    };

  const handleAccountSuccess =
    async () => {
      await refetchEmployees();
  };

  const handleSubmit =
    async () => {
      try {
        const commonPayload = {
          firstName:
            formData.firstName.trim(),

          lastName:
            formData.lastName
              ?.trim() ||
            undefined,

          displayName:
            formData.displayName
              ?.trim() ||
            undefined,

          email:
            formData.email
              .trim()
              .toLowerCase(),

          mobile:
            formData.mobile
              ?.trim() ||
            undefined,

          gender:
            formData.gender,

          organizationUnitUuid:
            formData.organizationUnitUuid ||
            undefined,

          departmentUuid:
            formData.departmentUuid ||
            undefined,

          designationUuid:
            formData.designationUuid ||
            undefined,

          managerUuid:
            formData.managerUuid ||
            undefined,

          joiningDate:
            formData.joiningDate ||
            undefined,

          employmentType:
            formData.employmentType,

          avatarUrl:
            formData.avatarUrl
              ?.trim() ||
            undefined,

          status:
            formData.status ??
            "ACTIVE",
        };

        if (editUuid) {
          const payload:
            UpdateEmployeeDto = {
            ...commonPayload,
          };

          await update(
            editUuid,
            payload,
          );
        } else {
          const payload:
            CreateEmployeeDto = {
            ...commonPayload,

            firstName:
              commonPayload.firstName,

            email:
              commonPayload.email,
          };

          await create(
            payload,
          );
        }

        handleClose();
      } catch (error: any) {
        console.error(
          error?.response?.data ??
            error,
        );
      }
    };

  const handleEdit =
    async (
      uuid: string,
    ) => {
      try {
        const employee =
          await fetchEmployee(
            uuid,
          );

        if (!employee) {
          return;
        }

        setEditUuid(
          uuid,
        );

        setFormData({
          firstName:
            employee.firstName,

          lastName:
            employee.lastName ??
            "",

          displayName:
            employee.displayName ??
            "",

          email:
            employee.email,

          mobile:
            employee.mobile ??
            "",

          gender:
            employee.gender ??
            undefined,

          organizationUnitUuid:
            employee.organizationUnit
              ?.uuid ?? "",

          departmentUuid:
            employee.department
              ?.uuid ?? "",

          designationUuid:
            employee.designation
              ?.uuid ?? "",

          managerUuid:
            employee.manager
              ?.uuid ?? "",

          joiningDate:
            employee.joiningDate
              ?.slice(
                0,
                10,
              ) ?? "",

          employmentType:
            employee.employmentType ??
            undefined,

          avatarUrl:
            employee.avatarUrl ??
            "",

          status:
            employee.status,
        });

        setOpen(
          true,
        );
      } catch (error: any) {
        console.error(
          error?.response?.data ??
            error,
        );
      }
    };

  const handleView =
    async (
      uuid: string,
    ) => {
      try {
        const employee =
          await fetchEmployee(
            uuid,
          );

        if (!employee) {
          return;
        }

        setSelectedEmployee(
          employee,
        );

        setViewOpen(
          true,
        );
      } catch (error: any) {
        console.error(
          error?.response?.data ??
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
          "Are you sure you want to delete this employee?",
        );

      if (!confirmed) {
        return;
      }

      try {
        await remove(
          uuid,
        );
      } catch (error: any) {
        console.error(
          error?.response?.data ??
            error,
        );
      }
    };

  const columns:
    DataTableColumn<Employee>[] = [
    {
      key: "employeeCode",
      title: "Code",
    },

    {
      key: "displayName",
      title: "Employee",

      render: (
        row,
      ) =>
        row.displayName ||
        `${row.firstName} ${
          row.lastName ?? ""
        }`.trim(),
    },

    {
      key:
        "organizationUnit",
      title:
        "Location",

      render: (
        row,
      ) =>
        row.organizationUnit
          ?.name ?? "-",
    },

    {
      key: "department",
      title:
        "Department",

      render: (
        row,
      ) =>
        row.department
          ?.name ?? "-",
    },

    {
      key: "designation",
      title:
        "Designation",

      render: (
        row,
      ) =>
        row.designation
          ?.name ?? "-",
    },

    {
      key:
        "userAccount",
      title:
        "Login Account",
      align:
        "center",

      render: (
        row,
      ) => {
        if (!row.user) {
          return (
            <div>
              <div
                style={{
                  fontSize:
                    12,
                  fontWeight:
                    500,
                }}
              >
                Not Created
              </div>

              <div
                style={{
                  marginTop:
                    3,
                  fontSize:
                    11,
                  opacity:
                    0.65,
                }}
              >
                No login access
              </div>
            </div>
          );
        }

        return (
          <div>
            <div
              style={{
                fontWeight:
                  500,
              }}
            >
              {row.user.role
                ?.name ??
                "No Role"}
            </div>

            <div
              style={{
                marginTop:
                  3,
                fontSize:
                  12,
                opacity:
                  0.7,
              }}
            >
              {
                row.user.status
              }
            </div>
          </div>
        );
      },
    },

    {
      key: "email",
      title: "Email",

      render: (
        row,
      ) =>
        row.email ||
        "-",
    },

    {
      key: "mobile",
      title: "Mobile",

      render: (
        row,
      ) =>
        row.mobile ||
        "-",
    },

    {
      key: "status",
      title: "Status",
      align:
        "center",
    },

    {
      key: "actions",
      title: "Actions",
      align:
        "center",

      render: (
        row,
      ) => (
        <div
          style={{
            display:
              "flex",
            justifyContent:
              "center",
            gap: 8,
          }}
        >
          <Button
            size="sm"
            aria-label={`View ${
              row.displayName ||
              row.firstName
            }`}
            title="View Employee"
            onClick={() =>
              handleView(
                row.uuid,
              )
            }
          >
            <Eye
              size={16}
            />
          </Button>

          <Button
            size="sm"
            variant={
              row.user
                ? "secondary"
                : undefined
            }
            aria-label={
              row.user
                ? `Manage access for ${
                    row.displayName ||
                    row.firstName
                  }`
                : `Create login for ${
                    row.displayName ||
                    row.firstName
                  }`
            }
            title={
              row.user
                ? "Manage Access"
                : "Create Login"
            }
            onClick={() =>
              handleOpenAccount(
                row,
              )
            }
          >
            {row.user ? (
              <ShieldCheck
                size={16}
              />
            ) : (
              <UserPlus
                size={16}
              />
            )}
          </Button>

          <Button
            size="sm"
            aria-label={`Edit ${
              row.displayName ||
              row.firstName
            }`}
            title="Edit Employee"
            onClick={() =>
              handleEdit(
                row.uuid,
              )
            }
          >
            <SquarePen
              size={16}
            />
          </Button>

          <Button
            size="sm"
            variant="danger"
            aria-label={`Delete ${
              row.displayName ||
              row.firstName
            }`}
            title="Delete Employee"
            onClick={() =>
              handleDelete(
                row.uuid,
              )
            }
          >
            <Trash2
              size={16}
            />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Employees"
        subtitle="Manage company employees and login access"
        actions={
          <div
            style={{
              display:
                "flex",
              gap: 12,
            }}
          >
            <Button
              variant="secondary"
              onClick={() =>
                navigate(
                  -1,
                )
              }
            >
              Back
            </Button>

            <Button
              onClick={
                handleOpenCreate
              }
            >
              Add Employee
            </Button>
          </div>
        }
      />

      <Card>
        <DataTable
          loading={
            loading
          }
          data={
            employees
          }
          columns={
            columns
          }
          keyField="uuid"
          showSerialNumber
          emptyMessage="No Employees Found."
        />
      </Card>

      <EmployeeModal
        title={
          editUuid
            ? "Edit Employee"
            : "Create Employee"
        }
        isEdit={
          Boolean(
            editUuid,
          )
        }
        editingUuid={
          editUuid
        }
        open={
          open
        }
        loading={
          saving
        }
        employees={
          employees
        }
        organizationUnits={
          organizationUnits
        }
        departments={
          departments
        }
        designations={
          designations
        }
        formData={
          formData
        }
        setFormData={
          setFormData
        }
        onClose={
          handleClose
        }
        onSubmit={
          handleSubmit
        }
      />

      <EmployeeDetailsModal
        open={
          viewOpen
        }
        employee={
          selectedEmployee
        }
        onClose={() => {
          setViewOpen(
            false,
          );

          setSelectedEmployee(
            null,
          );
        }}
      />

      <EmployeeUserAccountModal
        open={
          accountModalOpen
        }
        employee={
          accountEmployee
        }
        roles={
          roles ?? []
        }
        onClose={
          handleCloseAccount
        }
        onSuccess={
          handleAccountSuccess
        }
      />
    </>
  );
};

export default EmployeePage;