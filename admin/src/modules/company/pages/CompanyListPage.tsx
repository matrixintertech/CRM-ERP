import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Eye,
  Building2,
  Shield,
} from "lucide-react";

import CompanyDetailsModal from "../components/CompanyDetailsModal";

import { useCompanies } from "../hooks/useCompanies";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";
import SearchInput from "@/shared/components/SearchInput";
import Select from "@/shared/components/Select";
import Pagination from "@/shared/components/Pagination";

import DataTable from "@/shared/components/DataTable/DataTable";

import type { DataTableColumn } from "@/shared/components/DataTable/types";
import type { Company } from "../types/company.types";



import styles from "./CompanyListPage.module.css";

const statusOptions = [
  {
    label: "All Status",
    value: "",
  },
  {
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "Inactive",
    value: "INACTIVE",
  },
];

const typeOptions = [
  {
    label: "All Types",
    value: "",
  },
  {
    label: "Interior",
    value: "INTERIOR",
  },
  {
    label: "Construction",
    value: "CONSTRUCTION",
  },
];

const CompanyListPage = () => {
  const navigate = useNavigate();

const {
  companies,
  pagination,
  loading,

  selectedCompany,
  detailsLoading,

  fetchCompany,
} = useCompanies();



const [openDetails, setOpenDetails] =
  useState(false);

const handleView = async (
  id: string,
) => {
  await fetchCompany(id);

  setOpenDetails(true);
};


const handleOrganization = (
  id: string,
) => {
  navigate(
    `/companies/${id}/organization`,
  );
};

const handleRoles = (
  id: string,
) => {
  navigate(
    `/companies/${id}/roles`,
  );
};


const columns: DataTableColumn<Company>[] = [
  {
    key: "name",
    title: "Company",
  },
  {
    key: "code",
    title: "Code",
  },
  {
    key: "email",
    title: "Email",
  },
  {
    key: "status",
    title: "Status",
    align: "center",
    render: (row) => (
      <span>{row.status}</span>
    ),
  },
  {
    key: "actions",
    title: "Actions",
    align: "center",
    render: (row) => (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Button
          size="sm"
          onClick={() =>
            handleView(row.id)
          }
        >
          <Eye size={16} />
        </Button>

        <Button
          size="sm"
          onClick={() =>
            handleOrganization(
              row.id,
            )
          }
        >
          <Building2 size={16} />
        </Button>

        <Button
          size="sm"
          onClick={() =>
            handleRoles(row.id)
          }
        >
          <Shield size={16} />
        </Button>
      </div>
    ),
  },
];

  return (
    <>
      <PageHeader
        title="Companies"
        subtitle="Manage all companies"
        actions={
          <Button
            onClick={() =>
              navigate(
                "/companies/create",
              )
            }
          >
            Create Company
          </Button>
        }
      />

      <Card>
        <div className={styles.filters}>
          <SearchInput placeholder="Search company..." />

          <Select
            options={statusOptions}
          />

          <Select
            options={typeOptions}
          />
        </div>

<DataTable
  loading={loading}
  data={companies}
  columns={columns}
  keyField="id"
  showSerialNumber
  emptyMessage="No companies found."
/>

        <Pagination
        page={
            pagination?.page ?? 1
        }
        totalPages={
            pagination?.totalPages ?? 1
        }
        totalRecords={
            pagination?.total ?? 0
        }
        pageSize={
            pagination?.limit ?? 10
        }
        onPageChange={() => {}}
        />

      <CompanyDetailsModal
  open={openDetails}
  loading={detailsLoading}
  company={selectedCompany}
  onClose={() =>
    setOpenDetails(false)
  }
/>

      </Card>
    </>
  );
};

export default CompanyListPage;