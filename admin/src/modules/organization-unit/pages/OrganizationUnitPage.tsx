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

import type { OrganizationUnitFormData } from "../types/organization-unit.types";

import DataTable from "@/shared/components/DataTable/DataTable";

import type { DataTableColumn } from "@/shared/components/DataTable/types";

import type {
  OrganizationUnit,
} from "../types/organization-unit.types";

import {
  Eye,
  SquarePen,
  Trash2,
} from "lucide-react";

const OrganizationUnitPage = () => {
  const navigate = useNavigate();

  const { companyId } = useParams();

  const {
  loading,
  organizationUnits,
  fetchOrganizationUnits,
  create,
} = useOrganizationUnits();

  useEffect(() => {
  if (companyId) {
    fetchOrganizationUnits(
      companyId,
    );
  }
}, [companyId]);


  const [open, setOpen] =
    useState(false);

  const [formData, setFormData] =
    useState<OrganizationUnitFormData>({
      companyId: Number(companyId),

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
    });

const handleSubmit = async () => {
  try {
    await create(formData);

    if (companyId) {
      await fetchOrganizationUnits(
        companyId,
      );
    }

    setOpen(false);

    setFormData({
      companyId: Number(companyId),
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
    });
  } catch (error: any) {
    console.log(
      error.response?.data,
    );
  }
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

          <Button size="sm">
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
              onClick={() =>
                setOpen(true)
              }
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
        open={open}
        loading={loading}
        formData={formData}
        setFormData={setFormData}
        onClose={() =>
          setOpen(false)
        }
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default OrganizationUnitPage;