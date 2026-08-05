import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Building2,
  Eye,
  Plus,
  Shield,
} from "lucide-react";

import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";
import DataTable from "@/shared/components/DataTable/DataTable";
import PageHeader from "@/shared/components/PageHeader";
import Pagination from "@/shared/components/Pagination";
import SearchInput from "@/shared/components/SearchInput";
import Select from "@/shared/components/Select";

import type { DataTableColumn } from "@/shared/components/DataTable/types";

import CompanyDetailsModal from "../components/CompanyDetailsModal";
import { useCompanies } from "../hooks/useCompanies";

import type {
  Company,
} from "../types/company.types";

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
    fetchCompanies,
    fetchCompany,
  } = useCompanies();

  const [openDetails, setOpenDetails] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [companyType, setCompanyType] =
    useState("");

  const [page, setPage] =
    useState(1);

  const pageSize = 10;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchCompanies({
        page,
        limit: pageSize,
        search:
          search.trim() || undefined,
        status: status || undefined,
        type:
          companyType || undefined,
      });
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    page,
    search,
    status,
    companyType,
    fetchCompanies,
  ]);

  const handleView = async (
    id: string,
  ) => {
    try {
      await fetchCompany(id);
      setOpenDetails(true);
    } catch (error) {
      console.error(
        "Failed to load company details:",
        error,
      );
    }
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

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (
    value: string,
  ) => {
    setStatus(value);
    setPage(1);
  };

  const handleTypeChange = (
    value: string,
  ) => {
    setCompanyType(value);
    setPage(1);
  };

  const modalCompany = useMemo(
    () =>
      selectedCompany
        ? {
            ...selectedCompany,
            email:
              selectedCompany.email ?? "",
          }
        : null,
    [selectedCompany],
  );

  const columns = useMemo<
    DataTableColumn<Company>[]
  >(
    () => [
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
        render: (row) =>
          row.email || "-",
      },
      {
        key: "mobile",
        title: "Mobile",
        render: (row) =>
          row.mobile || "-",
      },
      {
        key: "status",
        title: "Status",
        align: "center",
        render: (row) => (
          <span
            className={
              row.status === "ACTIVE"
                ? styles.activeStatus
                : styles.inactiveStatus
            }
          >
            {row.status}
          </span>
        ),
      },
      {
        key: "actions",
        title: "Actions",
        align: "center",
        render: (row) => (
          <div
            className={
              styles.actions
            }
          >
            <Button
              size="sm"
              aria-label={`View ${row.name}`}
              title="View company"
              onClick={() =>
                void handleView(row.id)
              }
            >
              <Eye size={16} />
            </Button>

            <Button
              size="sm"
              aria-label={`Open ${row.name} organization`}
              title="Organization"
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
              aria-label={`Manage ${row.name} roles`}
              title="Roles"
              onClick={() =>
                handleRoles(row.id)
              }
            >
              <Shield size={16} />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

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
            <Plus size={18} />
            Create Company
          </Button>
        }
      />

      <Card>
        <div className={styles.filters}>
          <SearchInput
            placeholder="Search company..."
            value={search}
            onChange={(event) =>
              handleSearchChange(
                event.target.value,
              )
            }
          />

          <Select
            value={status}
            onChange={(event) =>
              handleStatusChange(
                event.target.value,
              )
            }
            showPlaceholder={false}
            options={statusOptions}
          />

          <Select
            value={companyType}
            onChange={(event) =>
              handleTypeChange(
                event.target.value,
              )
            }
            showPlaceholder={false}
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
            pagination?.page ?? page
          }
          totalPages={
            pagination?.totalPages ?? 1
          }
          totalRecords={
            pagination?.total ?? 0
          }
          pageSize={
            pagination?.limit ??
            pageSize
          }
          onPageChange={setPage}
        />
      </Card>

      <CompanyDetailsModal
        open={openDetails}
        loading={detailsLoading}
        company={modalCompany}
        onClose={() =>
          setOpenDetails(false)
        }
      />
    </>
  );
};

export default CompanyListPage;