import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";
import DataTable from "@/shared/components/DataTable/DataTable";

import type { DataTableColumn } from "@/shared/components/DataTable/types";

import {
  Eye,
  SquarePen,
  Trash2,
} from "lucide-react";

import EmployeeModal from "../components/EmployeeModal";
import { useEmployee } from "../hooks/useEmployee";

import type {
  Employee,
  CreateEmployeeDto,
} from "../types/employee.types";

const EmployeePage = () => {
  const navigate = useNavigate();

  const defaultForm: CreateEmployeeDto = {
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    mobile: "",
    gender: undefined,
    organizationUnitId: "",
    departmentId: "",
    designationId: "",
    managerId: "",
    joiningDate: "",
    employmentType: undefined,
    avatarUrl: "",
    status: "ACTIVE",
  };

  const {
    loading,
    employees,
    fetchEmployees,
    fetchEmployee,
    create,
    update,
  } = useEmployee();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const [open, setOpen] =
    useState(false);

  const [editId, setEditId] =
    useState<string | null>(null);

  const [formData, setFormData] =
    useState(defaultForm);

  const handleSubmit =
    async () => {
      try {
        console.log(formData);
        if (editId) {
          await update(
            editId,
            formData,
          );
        } else {
          await create(formData);
        }

        await fetchEmployees();

        setOpen(false);
        setEditId(null);
        setFormData(defaultForm);
      } catch (error: any) {
        console.error(
          error.response?.data ??
            error,
        );
      }
    };

  const handleEdit =
    async (uuid: string) => {
      const employee =
        await fetchEmployee(uuid);

      if (!employee) return;

      setEditId(uuid);

      setFormData({
        firstName:
          employee.firstName,
        lastName:
          employee.lastName ?? "",
        displayName:
          employee.displayName ?? "",
        email: employee.email,
        mobile:
          employee.mobile ?? "",
        gender: employee.gender,
        organizationUnitId:
          employee.organizationUnit
            ?.uuid ?? "",
        departmentId:
          employee.department
            ?.uuid ?? "",
        designationId:
          employee.designation
            ?.uuid ?? "",
        managerId:
          employee.manager
            ?.uuid ?? "",
        joiningDate:
          employee.joiningDate ?? "",
        employmentType:
          employee.employmentType,
        avatarUrl:
          employee.avatarUrl ?? "",
        status:
          employee.status,
      });

      setOpen(true);
    };

  const columns: DataTableColumn<Employee>[] =
    [
      {
        key: "employeeCode",
        title: "Code",
      },
      {
        key: "displayName",
        title: "Employee",
      },
      {
        key: "email",
        title: "Email",
      },
      {
        key: "mobile",
        title: "Mobile",
      },
      {
        key: "status",
        title: "Status",
        align: "center",
      },
      {
        key: "actions",
        title: "Actions",
        align: "center",
        render: (row) => (
          <div
            style={{
              display: "flex",
              justifyContent:
                "center",
              gap: 8,
            }}
          >
            <Button size="sm">
              <Eye size={16} />
            </Button>

            <Button
              size="sm"
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
        subtitle="Manage company employees"
        actions={
          <div
            style={{
              display: "flex",
              gap: 12,
            }}
          >
            <Button
              variant="secondary"
              onClick={() =>
                navigate(-1)
              }
            >
              Back
            </Button>

            <Button
              onClick={() => {
                setEditId(null);
                setFormData(
                  defaultForm,
                );
                setOpen(true);
              }}
            >
              Add Employee
            </Button>
          </div>
        }
      />

      <Card>
        <DataTable
          loading={loading}
          data={employees ?? []}
          columns={columns}
          keyField="uuid"
          showSerialNumber
          emptyMessage="No Employees Found."
        />
      </Card>

      <EmployeeModal
        title={
          editId
            ? "Edit Employee"
            : "Create Employee"
        }
        isEdit={!!editId}
        open={open}
        loading={loading}
        formData={formData}
        setFormData={
          setFormData
        }
        onClose={() => {
          setOpen(false);
          setEditId(null);
          setFormData(
            defaultForm,
          );
        }}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default EmployeePage;