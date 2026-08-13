import {
  useCallback,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuthorization,
} from "@/shared/hooks/useAuthorization";

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
    hasPermission,
  } = useAuthorization();


  /*
   * Employee authorization.
   */
  const canViewEmployee =
    hasPermission(
      "company.employee.view",
    );

  const canCreateEmployee =
    hasPermission(
      "company.employee.create",
    );

  const canUpdateEmployee =
    hasPermission(
      "company.employee.update",
    );

  const canDeleteEmployee =
    hasPermission(
      "company.employee.delete",
    );


  /*
   * Login/user-account authorization.
   *
   * Employee data aur user account
   * separate authorization domains hain.
   */
  const canCreateUser =
    hasPermission(
      "company.user.create",
    );

  const canUpdateUser =
    hasPermission(
      "company.user.update",
    );


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
  } = useOrganizationUnits();


  const {
    departments,
  } = useDepartment();


  const {
    designations,
  } = useDesignation();


  const {
    roles,
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
      if (
        !canCreateEmployee
      ) {
        return;
      }


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
    /*
     * Existing account:
     * company.user.update
     *
     * New account:
     * company.user.create
     */
    const allowed =
      employee.user
        ? canUpdateUser
        : canCreateUser;


    if (!allowed) {
      return;
    }


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
      /*
       * Defensive UX checks.
       *
       * Backend remains final
       * authorization authority.
       */
      if (
        editUuid &&
        !canUpdateEmployee
      ) {
        return;
      }


      if (
        !editUuid &&
        !canCreateEmployee
      ) {
        return;
      }


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
      } catch (
        error: any
      ) {
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
      if (
        !canUpdateEmployee
      ) {
        return;
      }


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
      } catch (
        error: any
      ) {
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
      if (
        !canViewEmployee
      ) {
        return;
      }


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
      } catch (
        error: any
      ) {
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
      if (
        !canDeleteEmployee
      ) {
        return;
      }


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
      } catch (
        error: any
      ) {
        console.error(
          error?.response?.data ??
            error,
        );
      }
    };


  const columns:
    DataTableColumn<Employee>[] = [
    {
      key:
        "employeeCode",

      title:
        "Code",
    },

    {
      key:
        "displayName",

      title:
        "Employee",

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
      key:
        "department",

      title:
        "Department",

      render: (
        row,
      ) =>
        row.department
          ?.name ?? "-",
    },

    {
      key:
        "designation",

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
      key:
        "email",

      title:
        "Email",

      render: (
        row,
      ) =>
        row.email ||
        "-",
    },

    {
      key:
        "mobile",

      title:
        "Mobile",

      render: (
        row,
      ) =>
        row.mobile ||
        "-",
    },

    {
      key:
        "status",

      title:
        "Status",

      align:
        "center",
    },

    {
      key:
        "actions",

      title:
        "Actions",

      align:
        "center",

      render: (
        row,
      ) => {
        /*
         * Login account action depends
         * on whether account already exists.
         */
        const canManageAccount =
          row.user
            ? canUpdateUser
            : canCreateUser;


        const hasAnyAction =
          canViewEmployee ||
          canManageAccount ||
          canUpdateEmployee ||
          canDeleteEmployee;


        if (!hasAnyAction) {
          return "-";
        }


        return (
          <div
            style={{
              display:
                "flex",

              justifyContent:
                "center",

              gap: 8,
            }}
          >
            {canViewEmployee && (
              <Button
                size="sm"
                aria-label={`View ${
                  row.displayName ||
                  row.firstName
                }`}
                title="View Employee"
                onClick={() =>
                  void handleView(
                    row.uuid,
                  )
                }
              >
                <Eye
                  size={16}
                />
              </Button>
            )}


            {canManageAccount && (
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
            )}


            {canUpdateEmployee && (
              <Button
                size="sm"
                aria-label={`Edit ${
                  row.displayName ||
                  row.firstName
                }`}
                title="Edit Employee"
                onClick={() =>
                  void handleEdit(
                    row.uuid,
                  )
                }
              >
                <SquarePen
                  size={16}
                />
              </Button>
            )}


            {canDeleteEmployee && (
              <Button
                size="sm"
                variant="danger"
                aria-label={`Delete ${
                  row.displayName ||
                  row.firstName
                }`}
                title="Delete Employee"
                onClick={() =>
                  void handleDelete(
                    row.uuid,
                  )
                }
              >
                <Trash2
                  size={16}
                />
              </Button>
            )}
          </div>
        );
      },
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


            {canCreateEmployee && (
              <Button
                onClick={
                  handleOpenCreate
                }
              >
                Add Employee
              </Button>
            )}
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


      {(canCreateEmployee ||
        canUpdateEmployee) && (
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
      )}


      {canViewEmployee && (
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
      )}


      {(canCreateUser ||
        canUpdateUser) && (
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
      )}
    </>
  );
};


export default EmployeePage;