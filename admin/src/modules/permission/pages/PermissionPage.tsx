import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  SquarePen,
  Trash2,
} from "lucide-react";

import {
  useDocumentTitle,
} from "@/shared/hooks/useDocumentTitle";

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

import PermissionModal from "../components/PermissionModal";

import {
  usePermission,
} from "../hooks/usePermission";

import type {
  Permission,
  PermissionFormData,
  PermissionModule,
  PermissionSortField,
  PermissionStatus,
  PermissionType,
  SortOrder,
} from "../types/permission.types";

const createDefaultForm =
  (): PermissionFormData => ({
    module: "DASHBOARD",

    type: "COMPANY",

    name: "",

    code: "",

    description: "",

    status: "ACTIVE",
  });

const typeOptions = [
  {
    label: "All Types",
    value: "",
  },
  {
    label: "Company",
    value: "COMPANY",
  },
  {
    label: "Platform",
    value: "PLATFORM",
  },
];

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

const sortOptions = [
  {
    label: "Permission Name",
    value: "name",
  },
  {
    label: "Module",
    value: "module",
  },
  {
    label: "Code",
    value: "code",
  },
  {
    label: "Status",
    value: "status",
  },
];

const sortOrderOptions = [
  {
    label: "Ascending",
    value: "asc",
  },
  {
    label: "Descending",
    value: "desc",
  },
];

const PermissionPage = () => {
  const navigate =
    useNavigate();

  useDocumentTitle(
    "All Permissions",
  );

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    editUuid,
    setEditUuid,
  ] = useState<string | null>(
    null,
  );

  const [
    formData,
    setFormData,
  ] = useState<PermissionFormData>(
    createDefaultForm,
  );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState("");

  const [
    typeFilter,
    setTypeFilter,
  ] = useState<
    PermissionType | ""
  >("");

  const [
    moduleFilter,
    setModuleFilter,
  ] = useState<
    PermissionModule | ""
  >("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<
    PermissionStatus | ""
  >("");

  const [
    sortBy,
    setSortBy,
  ] = useState<PermissionSortField>(
    "name",
  );

  const [
    sortOrder,
    setSortOrder,
  ] = useState<SortOrder>(
    "asc",
  );

  const [
    page,
    setPage,
  ] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    const timeout =
      window.setTimeout(() => {
        setDebouncedSearch(
          search.trim(),
        );

        setPage(1);
      }, 300);

    return () => {
      window.clearTimeout(
        timeout,
      );
    };
  }, [search]);

  const {
    loading,
    fetching,

    permissions,
    pagination,

    moduleOptions:
      permissionModules,

    fetchPermission,

    create,
    update,
    remove,

    saving,
  } = usePermission({
    page,

    limit:
      pageSize,

    search:
      debouncedSearch ||
      undefined,

    type:
      typeFilter ||
      undefined,

    module:
      moduleFilter ||
      undefined,

    status:
      statusFilter ||
      undefined,

    sortBy,

    sortOrder,
  });

  const totalPages =
    pagination?.totalPages ??
    1;

  useEffect(() => {
    if (
      page >
      totalPages
    ) {
      setPage(
        totalPages,
      );
    }
  }, [
    page,
    totalPages,
  ]);

  const moduleOptions = [
    {
      label: "All Modules",
      value: "",
    },

    ...permissionModules.map(
      (module) => ({
        label:
          module
            .replaceAll(
              "_",
              " ",
            )
            .toLowerCase()
            .replace(
              /\b\w/g,
              (character) =>
                character.toUpperCase(),
            ),

        value:
          module,
      }),
    ),
  ];

  const resetForm = () => {
    setEditUuid(null);

    setFormData(
      createDefaultForm(),
    );
  };

  const handleOpenCreate = () => {
    resetForm();

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

    resetForm();
  };

  const handleSubmit =
    async () => {
      try {
        const payload:
          PermissionFormData = {
            module:
              formData.module,

            type:
              formData.type,

            name:
              formData.name
                .trim(),

            code:
              formData.code
                .trim()
                .toLowerCase(),

            description:
              formData.description
                ?.trim() ||
              undefined,

            status:
              formData.status ??
              "ACTIVE",
          };

        if (editUuid) {
          await update(
            editUuid,
            payload,
          );
        } else {
          await create(
            payload,
          );
        }

        handleClose();
      } catch (error) {
        console.error(
          "Failed to save permission:",
          error,
        );
      }
    };

  const handleEdit =
    async (
      uuid: string,
    ) => {
      try {
        const permission =
          await fetchPermission(
            uuid,
          );

        setEditUuid(
          uuid,
        );

        setFormData({
          module:
            permission.module,

          type:
            permission.type,

          name:
            permission.name,

          code:
            permission.code,

          description:
            permission.description ??
            "",

          status:
            permission.status,
        });

        setOpen(true);
      } catch (error) {
        console.error(
          "Failed to load permission:",
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
          "Are you sure you want to delete this permission?",
        );

      if (!confirmed) {
        return;
      }

      try {
        await remove(
          uuid,
        );
      } catch (error) {
        console.error(
          "Failed to delete permission:",
          error,
        );
      }
    };

  const handleTypeChange = (
    value: string,
  ) => {
    setTypeFilter(
      value as
        | PermissionType
        | "",
    );

    /*
     * Type change hone par old module filter
     * invalid ho sakta hai.
     */
    setModuleFilter("");

    setPage(1);
  };

  const handleModuleChange = (
    value: string,
  ) => {
    setModuleFilter(
      value as
        | PermissionModule
        | "",
    );

    setPage(1);
  };

  const handleStatusChange = (
    value: string,
  ) => {
    setStatusFilter(
      value as
        | PermissionStatus
        | "",
    );

    setPage(1);
  };

  const handleSortChange = (
    value: string,
  ) => {
    setSortBy(
      value as
        PermissionSortField,
    );

    setPage(1);
  };

  const handleSortOrderChange = (
    value: string,
  ) => {
    setSortOrder(
      value as SortOrder,
    );

    setPage(1);
  };

  const columns:
    DataTableColumn<Permission>[] = [
      {
        key: "module",
        title: "Module",

        render: (row) =>
          row.module
            .replaceAll(
              "_",
              " ",
            )
            .toLowerCase()
            .replace(
              /\b\w/g,
              (character) =>
                character.toUpperCase(),
            ),
      },

      {
        key: "type",
        title: "Type",
        align: "center",

        render: (row) =>
          row.type === "PLATFORM"
            ? "Platform"
            : "Company",
      },

      {
        key: "name",
        title: "Permission",
      },

      {
        key: "code",
        title: "Code",
      },

      {
        key: "description",
        title: "Description",

        render: (row) =>
          row.description ||
          "-",
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
            <Button
              size="sm"
              aria-label={`Edit ${row.name}`}
              title="Edit permission"
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

            <Button
              size="sm"
              variant="danger"
              aria-label={`Delete ${row.name}`}
              title="Delete permission"
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
          </div>
        ),
      },
    ];

  return (
    <>
      <PageHeader
        title="Permissions"
        subtitle="Manage platform and company permissions"
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
              onClick={
                handleOpenCreate
              }
            >
              Add Permission
            </Button>
          </div>
        }
      />

      <Card>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(220px, 1fr) repeat(5, minmax(140px, 180px))",
            gap: 12,
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <SearchInput
            placeholder="Search permission..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
          />

          <Select
            value={
              typeFilter
            }
            showPlaceholder={
              false
            }
            options={
              typeOptions
            }
            onChange={(event) =>
              handleTypeChange(
                event.target.value,
              )
            }
          />

          <Select
            value={
              moduleFilter
            }
            showPlaceholder={
              false
            }
            options={
              moduleOptions
            }
            onChange={(event) =>
              handleModuleChange(
                event.target.value,
              )
            }
          />

          <Select
            value={
              statusFilter
            }
            showPlaceholder={
              false
            }
            options={
              statusOptions
            }
            onChange={(event) =>
              handleStatusChange(
                event.target.value,
              )
            }
          />

          <Select
            value={
              sortBy
            }
            showPlaceholder={
              false
            }
            options={
              sortOptions
            }
            onChange={(event) =>
              handleSortChange(
                event.target.value,
              )
            }
          />

          <Select
            value={
              sortOrder
            }
            showPlaceholder={
              false
            }
            options={
              sortOrderOptions
            }
            onChange={(event) =>
              handleSortOrderChange(
                event.target.value,
              )
            }
          />
        </div>

        <DataTable
          loading={
            loading ||
            fetching
          }
          data={permissions}
          columns={columns}
          keyField="uuid"
          showSerialNumber
          serialNumberStart={
            (
              (pagination?.page ?? page) -
              1
            ) *
            (
              pagination?.limit ??
              pageSize
            )
          }
          emptyMessage="No permissions found."
        />

        <Pagination
          page={
            pagination?.page ??
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

      <PermissionModal
        title={
          editUuid
            ? "Edit Permission"
            : "Create Permission"
        }
        isEdit={
          Boolean(
            editUuid,
          )
        }
        open={open}
        loading={saving}
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
    </>
  );
};

export default PermissionPage;