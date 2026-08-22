import {
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Power,
  SquarePen,
  Trash2,
} from "lucide-react";

import {
  useDocumentTitle,
} from "@/shared/hooks/useDocumentTitle";

import {
  useAuthorization,
} from "@/shared/hooks/useAuthorization";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";
import Badge from "@/shared/components/Badge";

import Table, {
  type Column,
} from "@/shared/components/Table";

import VendorCategoryModal from "../components/VendorCategoryModal";

import {
  useVendorCategories,
} from "../hooks/useVendorCategories";

import type {
  CreateVendorCategoryDto,
  VendorCategoryQueryParams,
} from "../api/vendor-category.api";

import type {
  VendorCategorySummary,
} from "../types/vendor.types";


const initialQuery:
  VendorCategoryQueryParams = {
  page: 1,
  limit: 20,
  search: undefined,
};


const VendorCategoryPage = () => {
  useDocumentTitle(
    "Vendor Categories",
  );


  /*
   * =========================================================
   * PERMISSIONS
   * =========================================================
   */

  const {
    hasPermission,
  } = useAuthorization();


  const canView =
    hasPermission(
      "platform.vendor_category.view",
    );


  const canCreate =
    hasPermission(
      "platform.vendor_category.create",
    );


  const canUpdate =
    hasPermission(
      "platform.vendor_category.update",
    );


  const canDelete =
    hasPermission(
      "platform.vendor_category.delete",
    );


  /*
   * =========================================================
   * FILTER STATE
   * =========================================================
   */

  const [
    searchValue,
    setSearchValue,
  ] = useState("");


  const [
    query,
    setQuery,
  ] =
    useState<VendorCategoryQueryParams>(
      initialQuery,
    );


  /*
   * =========================================================
   * API
   * =========================================================
   */

  const {
    categories,

    total,
    page,
    totalPages,

    loading,
    fetching,

    fetchCategory,

    createCategory,
    updateCategory,
    updateCategoryStatus,
    deleteCategory,

    creating,
    updating,
    updatingStatus,
    deleting,
  } =
    useVendorCategories(
      query,
    );


  /*
   * =========================================================
   * CREATE / EDIT MODAL
   * =========================================================
   */

  const [
    openModal,
    setOpenModal,
  ] = useState(false);


  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState<
      VendorCategorySummary | null
    >(null);


  /*
   * =========================================================
   * SEARCH
   * =========================================================
   */

  const handleSearch =
    () => {
      setQuery(
        (previous) => ({
          ...previous,

          page: 1,

          search:
            searchValue
              .trim() ||
            undefined,
        }),
      );
    };


  /*
   * =========================================================
   * RESET
   * =========================================================
   */

  const handleReset =
    () => {
      setSearchValue(
        "",
      );

      setQuery({
        ...initialQuery,
      });
    };


  /*
   * =========================================================
   * CREATE
   * =========================================================
   */

  const handleCreate =
    () => {
      if (!canCreate) {
        return;
      }


      setSelectedCategory(
        null,
      );

      setOpenModal(
        true,
      );
    };


  /*
   * =========================================================
   * EDIT
   * =========================================================
   */

  const handleEdit =
    async (
      categoryUuid:
        string,
    ) => {
      if (!canUpdate) {
        return;
      }


      try {
        setSelectedCategory(
          null,
        );


        const category =
          await fetchCategory(
            categoryUuid,
          );


        setSelectedCategory(
          category,
        );

        setOpenModal(
          true,
        );
      } catch {
        setOpenModal(
          false,
        );
      }
    };


  /*
   * =========================================================
   * CREATE / UPDATE SUBMIT
   * =========================================================
   */

  const handleSubmit =
    async (
      formData:
        CreateVendorCategoryDto,
    ) => {
      if (
        selectedCategory
      ) {
        if (!canUpdate) {
          return;
        }


        await updateCategory({
          categoryUuid:
            selectedCategory
              .uuid,

          payload: {
            name:
              formData.name,

            code:
              formData.code,

            description:
              formData.description,

            sortOrder:
              formData.sortOrder,
          },
        });
      } else {
        if (!canCreate) {
          return;
        }


        await createCategory(
          formData,
        );
      }


      setOpenModal(
        false,
      );

      setSelectedCategory(
        null,
      );
    };


  /*
   * =========================================================
   * CLOSE MODAL
   * =========================================================
   */

  const handleCloseModal =
    () => {
      if (
        creating ||
        updating
      ) {
        return;
      }


      setOpenModal(
        false,
      );

      setSelectedCategory(
        null,
      );
    };


  /*
   * =========================================================
   * STATUS
   * =========================================================
   */

  const handleStatusChange =
    async (
      category:
        VendorCategorySummary,
    ) => {
      if (!canUpdate) {
        return;
      }


      const nextStatus =
        category.status ===
        "ACTIVE"
          ? "INACTIVE"
          : "ACTIVE";


      const confirmed =
        window.confirm(
          `Are you sure you want to ${
            nextStatus ===
            "ACTIVE"
              ? "activate"
              : "deactivate"
          } ${category.name}?`,
        );


      if (!confirmed) {
        return;
      }


      await updateCategoryStatus({
        categoryUuid:
          category.uuid,

        status:
          nextStatus,
      });
    };


  /*
   * =========================================================
   * DELETE
   * =========================================================
   */

  const handleDelete =
    async (
      category:
        VendorCategorySummary,
    ) => {
      if (!canDelete) {
        return;
      }


      const confirmed =
        window.confirm(
          `Are you sure you want to delete ${category.name}?`,
        );


      if (!confirmed) {
        return;
      }


      await deleteCategory(
        category.uuid,
      );
    };


  /*
   * =========================================================
   * PAGINATION
   * =========================================================
   */

  const handlePageChange =
    (
      nextPage:
        number,
    ) => {
      if (
        nextPage < 1 ||
        nextPage >
          totalPages
      ) {
        return;
      }


      setQuery(
        (previous) => ({
          ...previous,

          page:
            nextPage,
        }),
      );
    };


  /*
   * =========================================================
   * TABLE
   * =========================================================
   */

  const columns =
    useMemo<
      Column<VendorCategorySummary>[]
    >(
      () => [
        {
          key: "name",

          title:
            "Category Name",

          render: (
            value,
            row,
          ) => (
            <div>
              <div className="font-medium text-gray-900">
                {String(
                  value ??
                    "-",
                )}
              </div>

              {row.description && (
                <div className="mt-1 max-w-[320px] text-xs text-gray-500">
                  {
                    row.description
                  }
                </div>
              )}
            </div>
          ),
        },

        {
          key: "code",

          title:
            "Code",

          render: (
            value,
          ) => (
            <span className="text-sm font-medium text-gray-700">
              {String(
                value ??
                  "-",
              )}
            </span>
          ),
        },

        {
          key: "sortOrder",

          title:
            "Sort Order",

          render: (
            value,
          ) => (
            <span className="text-sm">
              {String(
                value ??
                  0,
              )}
            </span>
          ),
        },

        {
          key: "status",

          title:
            "Status",

          render: (
            value,
          ) => (
            <Badge
              status={String(
                value,
              )}
            />
          ),
        },

        ...(canUpdate ||
        canDelete
          ? [
              {
                key:
                  "action" as keyof VendorCategorySummary,

                title:
                  "Action",

                render: (
                  _value: unknown,
                  row:
                    VendorCategorySummary,
                ) => (
                  <div className="flex items-center gap-2">
                    {canUpdate && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        title="Edit Category"
                        disabled={
                          updating ||
                          updatingStatus
                        }
                        onClick={() =>
                          handleEdit(
                            row.uuid,
                          )
                        }
                      >
                        <SquarePen
                          size={
                            16
                          }
                        />
                      </Button>
                    )}


                    {canUpdate && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        title={
                          row.status ===
                          "ACTIVE"
                            ? "Deactivate Category"
                            : "Activate Category"
                        }
                        disabled={
                          updatingStatus
                        }
                        onClick={() =>
                          handleStatusChange(
                            row,
                          )
                        }
                      >
                        <Power
                          size={
                            16
                          }
                        />
                      </Button>
                    )}


                    {canDelete && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        title="Delete Category"
                        disabled={
                          deleting
                        }
                        onClick={() =>
                          handleDelete(
                            row,
                          )
                        }
                      >
                        <Trash2
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
      ],
      [
        canDelete,
        canUpdate,
        deleting,
        updating,
        updatingStatus,
      ],
    );


  const backgroundFetching =
    fetching &&
    !loading;


  const saving =
    creating ||
    updating;


  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (
    <>
      <PageHeader
        title="Vendor Categories"
        subtitle="Manage global vendor categories used across the marketplace"
        actions={
          canCreate ? (
            <Button
              type="button"
              onClick={
                handleCreate
              }
            >
              <Plus
                size={16}
              />

              Add Category
            </Button>
          ) : undefined
        }
      />


      <Card>
        {/* Search */}

        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "minmax(240px, 1fr) auto auto",

            alignItems:
              "end",

            gap:
              12,

            marginBottom:
              24,
          }}
        >
          <Input
            label="Search"
            placeholder="Category name or code"
            value={
              searchValue
            }
            onChange={(
              event,
            ) =>
              setSearchValue(
                event
                  .target
                  .value,
              )
            }
            onKeyDown={(
              event,
            ) => {
              if (
                event.key ===
                "Enter"
              ) {
                handleSearch();
              }
            }}
          />


          <Button
            type="button"
            loading={
              loading
            }
            onClick={
              handleSearch
            }
          >
            Search
          </Button>


          <Button
            type="button"
            variant="secondary"
            disabled={
              loading
            }
            onClick={
              handleReset
            }
          >
            Reset
          </Button>
        </div>


        {/* Background Fetch */}

        {backgroundFetching && (
          <div
            style={{
              marginBottom:
                12,

              color:
                "#6b7280",

              fontSize:
                12,
            }}
          >
            Updating vendor categories...
          </div>
        )}


        {/* Table */}

        {canView ? (
          <Table
            columns={
              columns
            }
            data={
              categories
            }
            loading={
              loading
            }
          />
        ) : (
          <div
            style={{
              padding:
                "24px 0",

              color:
                "#6b7280",

              textAlign:
                "center",
            }}
          >
            You do not have permission to view vendor categories.
          </div>
        )}


        {/* Pagination */}

        {canView &&
          total >
            0 && (
            <div
              style={{
                display:
                  "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                gap:
                  16,

                marginTop:
                  20,

                paddingTop:
                  16,

                borderTop:
                  "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  color:
                    "#6b7280",

                  fontSize:
                    13,
                }}
              >
                Total{" "}
                {total}{" "}
                categor
                {total ===
                1
                  ? "y"
                  : "ies"}
              </div>


              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap:
                    10,
                }}
              >
                <Button
                  type="button"
                  variant="secondary"
                  disabled={
                    page <=
                      1 ||
                    loading
                  }
                  onClick={() =>
                    handlePageChange(
                      page -
                        1,
                    )
                  }
                >
                  Previous
                </Button>


                <span
                  style={{
                    minWidth:
                      90,

                    textAlign:
                      "center",

                    color:
                      "#374151",

                    fontSize:
                      13,
                  }}
                >
                  Page{" "}
                  {page}{" "}
                  of{" "}
                  {Math.max(
                    totalPages,
                    1,
                  )}
                </span>


                <Button
                  type="button"
                  variant="secondary"
                  disabled={
                    page >=
                      totalPages ||
                    loading
                  }
                  onClick={() =>
                    handlePageChange(
                      page +
                        1,
                    )
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
      </Card>


      {/* Create / Edit Modal */}

      <VendorCategoryModal
        open={
          openModal
        }

        category={
          selectedCategory
        }

        loading={
          saving
        }

        onClose={
          handleCloseModal
        }

        onSubmit={
          handleSubmit
        }
      />
    </>
  );
};


export default VendorCategoryPage;