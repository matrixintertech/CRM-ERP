import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Building2,
  Eye,
  Plus,
  Shield,
} from "lucide-react";

import {
  useDocumentTitle,
} from "@/shared/hooks/useDocumentTitle";

import {
  useAuthorization,
} from "@/shared/hooks/useAuthorization";

import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";
import DataTable from "@/shared/components/DataTable/DataTable";
import PageHeader from "@/shared/components/PageHeader";
import Pagination from "@/shared/components/Pagination";
import SearchInput from "@/shared/components/SearchInput";
import Select from "@/shared/components/Select";

import type {
  DataTableColumn,
} from "@/shared/components/DataTable/types";

import CompanyDetailsModal from "../components/CompanyDetailsModal";

import {
  useCompanies,
} from "../hooks/useCompanies";

import type {
  Company,
  CompanyStatus,
  CompanyType,
} from "../types/company.types";

import styles from "./CompanyListPage.module.css";


const statusOptions = [
  {
    label:
      "All Status",
    value:
      "",
  },
  {
    label:
      "Active",
    value:
      "ACTIVE",
  },
  {
    label:
      "Inactive",
    value:
      "INACTIVE",
  },
  {
    label:
      "Suspended",
    value:
      "SUSPENDED",
  },
];


const typeOptions = [
  {
    label:
      "All Types",
    value:
      "",
  },
  {
    label:
      "Interior",
    value:
      "INTERIOR",
  },
  {
    label:
      "Construction",
    value:
      "CONSTRUCTION",
  },
];


const CompanyListPage = () => {
  const navigate =
    useNavigate();


  useDocumentTitle(
    "Companies",
  );


  const {
    hasPermission,
  } = useAuthorization();


  const canViewCompany =
    hasPermission(
      "platform.company.view",
    );

  const canCreateCompany =
    hasPermission(
      "platform.company.create",
    );

  const canUpdateCompany =
    hasPermission(
      "platform.company.update",
    );


  /*
   * Organization / company-role
   * management currently does not
   * have a separate platform
   * permission family.
   *
   * Until that exists, treat these
   * as company configuration/update.
   */
  const canManageCompany =
    canUpdateCompany;


  const [
    openDetails,
    setOpenDetails,
  ] = useState(false);

  const [
    selectedCompany,
    setSelectedCompany,
  ] = useState<
    Company | null
  >(null);

  const [
    detailsLoading,
    setDetailsLoading,
  ] = useState(false);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState<
    CompanyStatus | ""
  >("");

  const [
    companyType,
    setCompanyType,
  ] = useState<
    CompanyType | ""
  >("");

  const [
    page,
    setPage,
  ] = useState(1);


  const pageSize =
    10;


  useEffect(() => {
    const timeout =
      window.setTimeout(
        () => {
          setDebouncedSearch(
            search.trim(),
          );
        },
        300,
      );

    return () => {
      window.clearTimeout(
        timeout,
      );
    };
  }, [
    search,
  ]);


  const {
    companies,
    pagination,
    loading,
    fetchCompany,
  } = useCompanies({
    page,

    limit:
      pageSize,

    search:
      debouncedSearch ||
      undefined,

    status:
      status ||
      undefined,

    type:
      companyType ||
      undefined,
  });


  const handleView =
    async (
      id: string,
    ) => {
      if (
        !canViewCompany
      ) {
        return;
      }

      try {
        setSelectedCompany(
          null,
        );

        setDetailsLoading(
          true,
        );

        setOpenDetails(
          true,
        );

        const company =
          await fetchCompany(
            id,
          );

        setSelectedCompany(
          company,
        );
      } catch (error) {
        console.error(
          "Failed to load company details:",
          error,
        );

        setOpenDetails(
          false,
        );
      } finally {
        setDetailsLoading(
          false,
        );
      }
    };


  const handleCloseDetails =
    () => {
      setOpenDetails(
        false,
      );

      setSelectedCompany(
        null,
      );
    };


  const handleCreate =
    () => {
      if (
        !canCreateCompany
      ) {
        return;
      }

      navigate(
        "/companies/create",
      );
    };


  const handleOrganization =
    (
      id: string,
    ) => {
      if (
        !canManageCompany
      ) {
        return;
      }

      navigate(
        `/companies/${id}/organization`,
      );
    };


  const handleRoles =
    (
      id: string,
    ) => {
      if (
        !canManageCompany
      ) {
        return;
      }

      navigate(
        `/companies/${id}/roles`,
      );
    };


  const handleSearchChange =
    (
      value: string,
    ) => {
      setSearch(
        value,
      );

      setPage(
        1,
      );
    };


  const handleStatusChange =
    (
      value: string,
    ) => {
      setStatus(
        value as
          | CompanyStatus
          | "",
      );

      setPage(
        1,
      );
    };


  const handleTypeChange =
    (
      value: string,
    ) => {
      setCompanyType(
        value as
          | CompanyType
          | "",
      );

      setPage(
        1,
      );
    };


  const hasActions =
    canViewCompany ||
    canManageCompany;


  const columns:
    DataTableColumn<Company>[] = [
      {
        key:
          "name",

        title:
          "Company",
      },

      {
        key:
          "code",

        title:
          "Code",
      },

      {
        key:
          "email",

        title:
          "Email",

        render:
          (row) =>
            row.email ??
            "-",
      },

      {
        key:
          "mobile",

        title:
          "Mobile",

        render:
          (row) =>
            row.mobile ??
            "-",
      },

      {
        key:
          "type",

        title:
          "Type",

        render:
          (row) =>
            row.type
              ? row.type
                  .toLowerCase()
                  .replace(
                    /\b\w/g,
                    (
                      character,
                    ) =>
                      character.toUpperCase(),
                  )
              : "-",
      },

      {
        key:
          "status",

        title:
          "Status",

        align:
          "center",

        render:
          (row) => (
            <span
              className={
                row.status ===
                "ACTIVE"
                  ? styles.activeStatus
                  : styles.inactiveStatus
              }
            >
              {
                row.status
              }
            </span>
          ),
      },

      ...(hasActions
        ? [
            {
              key:
                "actions",

              title:
                "Actions",

              align:
                "center" as const,

              render:
                (
                  row:
                    Company,
                ) => (
                  <div
                    className={
                      styles.actions
                    }
                  >
                    {canViewCompany && (
                      <Button
                        size="sm"
                        aria-label={`View ${row.name}`}
                        title="View company"
                        onClick={() =>
                          void handleView(
                            row.id,
                          )
                        }
                      >
                        <Eye
                          size={
                            16
                          }
                        />
                      </Button>
                    )}

                    {canManageCompany && (
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
                        <Building2
                          size={
                            16
                          }
                        />
                      </Button>
                    )}

                    {canManageCompany && (
                      <Button
                        size="sm"
                        aria-label={`Manage ${row.name} roles`}
                        title="Roles"
                        onClick={() =>
                          handleRoles(
                            row.id,
                          )
                        }
                      >
                        <Shield
                          size={
                            16
                          }
                        />
                      </Button>
                    )}
                  </div>
                ),
            },
          ]
        : []),
    ];


  return (
    <>
      <PageHeader
        title="Companies"
        subtitle="Manage all companies"
        actions={
          canCreateCompany ? (
            <Button
              onClick={
                handleCreate
              }
            >
              <Plus
                size={18}
              />

              Create Company
            </Button>
          ) : undefined
        }
      />


      <Card>
        <div
          className={
            styles.filters
          }
        >
          <SearchInput
            placeholder="Search company..."
            value={
              search
            }
            onChange={(
              event,
            ) =>
              handleSearchChange(
                event.target
                  .value,
              )
            }
          />

          <Select
            value={
              status
            }
            onChange={(
              event,
            ) =>
              handleStatusChange(
                event.target
                  .value,
              )
            }
            showPlaceholder={
              false
            }
            options={
              statusOptions
            }
          />

          <Select
            value={
              companyType
            }
            onChange={(
              event,
            ) =>
              handleTypeChange(
                event.target
                  .value,
              )
            }
            showPlaceholder={
              false
            }
            options={
              typeOptions
            }
          />
        </div>


        <DataTable
          loading={
            loading
          }
          data={
            companies
          }
          columns={
            columns
          }
          keyField="id"
          showSerialNumber
          emptyMessage="No companies found."
        />


        <Pagination
          page={
            pagination
              ?.page ??
            page
          }
          totalPages={
            pagination
              ?.totalPages ??
            1
          }
          totalRecords={
            pagination
              ?.total ??
            0
          }
          pageSize={
            pagination
              ?.limit ??
            pageSize
          }
          onPageChange={
            setPage
          }
        />
      </Card>


      {canViewCompany && (
        <CompanyDetailsModal
          open={
            openDetails
          }
          loading={
            detailsLoading
          }
          company={
            selectedCompany
          }
          onClose={
            handleCloseDetails
          }
        />
      )}
    </>
  );
};


export default CompanyListPage;