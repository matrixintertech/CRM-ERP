import {
  useEffect,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";

import OrganizationUnitModal from "../components/OrganizationUnitModal";
import { useOrganizationUnits } from "../hooks/useOrganizationUnits";

import type {
  OrganizationUnit,
  OrganizationUnitFormData,
} from "../types/organization-unit.types";

import DataTable from "@/shared/components/DataTable/DataTable";

import type { DataTableColumn } from "@/shared/components/DataTable/types";



import {
  Eye,
  SquarePen,
  Trash2,
} from "lucide-react";

const OrganizationUnitPage = () => {
  const navigate = useNavigate();

  const { companyId } = useParams();


  const defaultForm: OrganizationUnitFormData = {
    parentId: undefined,
    type: "HEAD_OFFICE",
    name: "",
    code: "",
    email: "",
    mobile: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  };

const {
  loading,
  organizationUnits,
  fetchOrganizationUnits,
  fetchOrganizationUnit,
  create,
  update,
} = useOrganizationUnits();

useEffect(() => {
  fetchOrganizationUnits();
}, []);


  const [open, setOpen] =
    useState(false);

    const [editId, setEditId] =
  useState<number | null>(null);

   const [formData, setFormData] = useState(defaultForm);

const handleSubmit = async () => {
  try {
    if (editId) {
      await update(editId, {
        name: formData.name,
        code: formData.code,
        email: formData.email,
        mobile: formData.mobile,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        status: "ACTIVE",
      });
    } else {
      await create(formData);
    }

    // Refresh list
    await fetchOrganizationUnits();

    // Reset form
    setOpen(false);
    setEditId(null);
    setFormData(defaultForm);
  } catch (error: any) {
    console.error(error.response?.data || error);
  }
};

const handleEdit = async (id: number) => {
  const unit = await fetchOrganizationUnit(id);

  if (!unit) return;

  setEditId(id);

  setFormData({
    parentId: unit.parentId ?? undefined,
    type: unit.type,
    name: unit.name,
    code: unit.code,
    email: unit.email,
    mobile: unit.mobile,
    addressLine1: unit.addressLine1,
    addressLine2: unit.addressLine2,
    city: unit.city,
    state: unit.state,
    country: unit.country,
    pincode: unit.pincode,
  });

  setOpen(true);
};

const columns: DataTableColumn<OrganizationUnit>[] =
  [
    {
      key: "name",
      title: "Organization Unit",
    },
    {
      key: "code",
      title: "Code",
    },
    {
      key: "type",
      title: "Type",
      render: (row) =>
        row.type
          .replaceAll("_", " ")
          .toLowerCase()
          .replace(
            /\b\w/g,
            (c) =>
              c.toUpperCase(),
          ),
    },
    {
      key: "city",
      title: "City",
    },
    {
      key: "state",
      title: "State",
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
              handleEdit(row.id)
            }
          >
            <SquarePen size={16} />
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
        title="Organization Structure"
        subtitle="Manage organization hierarchy, branches and offices"
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
                navigate("/companies")
              }
            >
              Back
            </Button>

             <Button
              onClick={() => {
                setEditId(null);
                setFormData(defaultForm);
                setOpen(true);
              }}
            >
              Add Unit
            </Button>
          </div>
        }
      />

<Card>
  <DataTable
    loading={loading}
    data={
      organizationUnits ?? []
    }
    columns={columns}
    keyField="id"
    showSerialNumber
    emptyMessage="No Organization Units Found."
  />
</Card>

      <OrganizationUnitModal
        title={
          editId
            ? "Edit Organization Unit"
            : "Create Organization Unit"
        }
        isEdit={!!editId}
        open={open}
        loading={loading}
        organizationUnits={organizationUnits}
        formData={formData}
        setFormData={setFormData}
        onClose={() => {
          setOpen(false);
          setEditId(null);
          setFormData(defaultForm);
        }}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default OrganizationUnitPage;