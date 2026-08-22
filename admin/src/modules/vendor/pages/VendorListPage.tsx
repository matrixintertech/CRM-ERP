import {
  useState,
} from "react";

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
import Select from "@/shared/components/Select";

import VendorTable from "../components/VendorTable";
import VendorModal from "../components/VendorModal";

import {
  useVendors,
} from "../hooks/useVendors";

import {
  useVendorCategories,
} from "../hooks/useVendorCategories";

import VendorCategoryAssignmentModal from "../components/VendorCategoryAssignmentModal";

import VendorDetailsModal from "../components/VendorDetailsModal";


import type {
  CreateVendorDto,
  UpdateVendorCategoriesDto,
  Vendor,
  VendorCategoryAssignment,
  VendorMarketplaceStatus,
  VendorQueryParams,
  VendorStatus,
} from "../types/vendor.types";




const initialQuery:
  VendorQueryParams = {
  page: 1,
  limit: 20,

  search:
    undefined,

  status:
    undefined,

  marketplaceStatus:
    undefined,
};


const VendorListPage = () => {
  useDocumentTitle(
    "Vendors",
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
      "platform.vendor.view",
    );


  const canCreate =
    hasPermission(
      "platform.vendor.create",
    );


  const canUpdate =
    hasPermission(
      "platform.vendor.update",
    );


  const canDelete =
    hasPermission(
      "platform.vendor.delete",
    );


  /*
   * Category assignment currently uses
   * platform.vendor.update permission.
   */
const canViewVendorCategory =
  hasPermission(
    "platform.vendor_category.view",
  );

const canManageCategories =
  canUpdate &&
  canViewVendorCategory;


  /*
   * =========================================================
   * FILTER STATE
   * =========================================================
   */

  const [
    searchValue,
    setSearchValue,
  ] =
    useState("");


  const [
    status,
    setStatus,
  ] =
    useState<
      VendorStatus | ""
    >("");


  const [
    marketplaceStatus,
    setMarketplaceStatus,
  ] =
    useState<
      | VendorMarketplaceStatus
      | ""
    >("");


  const [
    query,
    setQuery,
  ] =
    useState<VendorQueryParams>(
      initialQuery,
    );


    const [
        openDetailsModal,
        setOpenDetailsModal,
        ] = useState(false);

        const [
        detailsVendor,
        setDetailsVendor,
        ] = useState<Vendor | null>(
        null,
        );


  /*
   * =========================================================
   * VENDOR API
   * =========================================================
   */

  const {
  vendors,

  total,
  page,
  totalPages,

  loading,
  fetching,

  fetchVendor,
  fetchVendorCategories,

  createVendor,
  updateVendor,
  deleteVendor,
  saveVendorCategories,

  creating,
  updating,
  deleting,
  savingCategories,
} = useVendors(
  query,
);


const {
  categories:
    vendorCategories,

  loading:
    vendorCategoriesLoading,
} = useVendorCategories({
  page: 1,
  limit: 100,
});

  /*
   * =========================================================
   * MODAL STATE
   * =========================================================
   */

  const [
    openVendorModal,
    setOpenVendorModal,
  ] =
    useState(false);


  const [
    selectedVendor,
    setSelectedVendor,
  ] =
    useState<
      Vendor | null
    >(null);


    // Categotries Modal state
    const [
  openCategoryModal,
  setOpenCategoryModal,
] = useState(false);


const [
  categoryVendor,
  setCategoryVendor,
] =
  useState<Vendor | null>(
    null,
  );


const [
  categoryAssignments,
  setCategoryAssignments,
] = useState<
  VendorCategoryAssignment[]
>([]);


const [
  loadingCategoryAssignments,
  setLoadingCategoryAssignments,
] = useState(false);


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

          status:
            status ||
            undefined,

          marketplaceStatus:
            marketplaceStatus ||
            undefined,
        }),
      );
    };


  /*
   * =========================================================
   * RESET FILTER
   * =========================================================
   */

  const handleReset =
    () => {
      setSearchValue(
        "",
      );

      setStatus(
        "",
      );

      setMarketplaceStatus(
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


      setSelectedVendor(
        null,
      );

      setOpenVendorModal(
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
      vendorUuid:
        string,
    ) => {
      if (!canUpdate) {
        return;
      }


      try {
        setSelectedVendor(
          null,
        );


        const vendor =
          await fetchVendor(
            vendorUuid,
          );


        setSelectedVendor(
          vendor,
        );

        setOpenVendorModal(
          true,
        );
      } catch {
        setOpenVendorModal(
          false,
        );
      }
    };


  /*
   * =========================================================
   * SUBMIT CREATE / UPDATE
   * =========================================================
   */

  const handleVendorSubmit =
    async (
      formData:
        CreateVendorDto,
    ) => {
      if (
        selectedVendor
      ) {
        if (!canUpdate) {
          return;
        }


        await updateVendor({
          vendorUuid:
            selectedVendor
              .uuid,

          payload:
            formData,
        });
      } else {
        if (!canCreate) {
          return;
        }


        await createVendor(
          formData,
        );
      }


      setOpenVendorModal(
        false,
      );

      setSelectedVendor(
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


      setOpenVendorModal(
        false,
      );

      setSelectedVendor(
        null,
      );
    };


  /*
   * =========================================================
   * DELETE
   * =========================================================
   */

  const handleDelete =
    async (
      vendorUuid:
        string,
    ) => {
      if (!canDelete) {
        return;
      }


      const vendor =
        vendors.find(
          (item) =>
            item.uuid ===
            vendorUuid,
        );


      const confirmed =
        window.confirm(
          `Are you sure you want to delete ${
            vendor
              ?.displayName ||
            vendor
              ?.legalName ||
            "this vendor"
          }?`,
        );


      if (!confirmed) {
        return;
      }


      await deleteVendor(
        vendorUuid,
      );
    };


  /*
   * =========================================================
   * VIEW
   * =========================================================
   */



const handleView =
  async (
    vendorUuid:
      string,
  ) => {
    if (!canView) {
      return;
    }

    try {
      setDetailsVendor(
        null,
      );

      const vendor =
        await fetchVendor(
          vendorUuid,
        );

      setDetailsVendor(
        vendor,
      );

      setOpenDetailsModal(
        true,
      );
    } catch {
      setOpenDetailsModal(
        false,
      );

      setDetailsVendor(
        null,
      );
    }
  };


  /*
   * =========================================================
   * CATEGORY MANAGEMENT
   * =========================================================
   *
   * VendorCategoryAssignmentModal
   * next step me connect hoga.
   */

const handleManageCategories =
  async (
    vendor: Vendor,
  ) => {
    if (
      !canManageCategories
    ) {
      return;
    }


    setCategoryVendor(
      vendor,
    );

    setCategoryAssignments(
      [],
    );

    setLoadingCategoryAssignments(
      true,
    );


    try {
      const result =
        await fetchVendorCategories(
          vendor.uuid,
        );


      setCategoryAssignments(
        result.categories ??
          [],
      );

      setOpenCategoryModal(
        true,
      );
    } catch {
      setCategoryVendor(
        null,
      );

      setOpenCategoryModal(
        false,
      );
    } finally {
      setLoadingCategoryAssignments(
        false,
      );
    }
  };

  const handleSaveCategories =
  async (
    payload:
      UpdateVendorCategoriesDto,
  ) => {
    if (
      !categoryVendor ||
      !canManageCategories
    ) {
      return;
    }


    await saveVendorCategories({
      vendorUuid:
        categoryVendor.uuid,

      payload,
    });


    setOpenCategoryModal(
      false,
    );

    setCategoryVendor(
      null,
    );

    setCategoryAssignments(
      [],
    );
  };

  const handleCloseCategoryModal =
  () => {
    if (
      savingCategories ||
      loadingCategoryAssignments
    ) {
      return;
    }


    setOpenCategoryModal(
      false,
    );

    setCategoryVendor(
      null,
    );

    setCategoryAssignments(
      [],
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
        title="Vendors"
        subtitle="Manage global vendors available on the platform"
        actions={
          canCreate ? (
            <Button
              type="button"
              onClick={
                handleCreate
              }
            >
              Add Vendor
            </Button>
          ) : undefined
        }
      />


      <Card>
        {/* Filters */}

        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "minmax(240px, 1fr) minmax(170px, 220px) minmax(190px, 220px) auto auto",

            alignItems:
              "end",

            gap: 12,

            marginBottom:
              24,
          }}
        >
          <Input
            label="Search"
            placeholder="Vendor, GST, PAN, email or mobile"
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


          <Select
            label="Vendor Status"
            value={
              status
            }
            options={[
              {
                label:
                  "All Statuses",

                value: "",
              },

              {
                label:
                  "Pending",

                value:
                  "PENDING",
              },

              {
                label:
                  "Active",

                value:
                  "ACTIVE",
              },

              {
                label:
                  "Suspended",

                value:
                  "SUSPENDED",
              },

              {
                label:
                  "Rejected",

                value:
                  "REJECTED",
              },
            ]}
            onChange={(
              event,
            ) =>
              setStatus(
                event
                  .target
                  .value as
                  | VendorStatus
                  | "",
              )
            }
          />


          <Select
            label="Marketplace"
            value={
              marketplaceStatus
            }
            options={[
              {
                label:
                  "All Marketplace",

                value: "",
              },

              {
                label:
                  "Private",

                value:
                  "PRIVATE",
              },

              {
                label:
                  "Pending",

                value:
                  "PENDING",
              },

              {
                label:
                  "Published",

                value:
                  "PUBLISHED",
              },

              {
                label:
                  "Suspended",

                value:
                  "SUSPENDED",
              },
            ]}
            onChange={(
              event,
            ) =>
              setMarketplaceStatus(
                event
                  .target
                  .value as
                  | VendorMarketplaceStatus
                  | "",
              )
            }
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


        {/* Background refresh */}

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
            Updating vendors...
          </div>
        )}


        {/* Vendor Table */}

        {canView ? (
          <VendorTable
  data={
    vendors
  }
  loading={
    loading
  }

  canView={
    canView
  }

  canEdit={
    canUpdate
  }

  canDelete={
    canDelete
  }

  canManageCategories={
    canManageCategories
  }

  onView={
    handleView
  }

  onEdit={
    handleEdit
  }

  onDelete={
    handleDelete
  }

  onManageCategories={
    handleManageCategories
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
            You do not have permission to view vendors.
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

                alignItems:
                  "center",

                justifyContent:
                  "space-between",

                gap: 16,

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
                vendor
                {total !==
                1
                  ? "s"
                  : ""}
              </div>


              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap: 10,
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
                  {page} of{" "}
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

      <VendorModal
        open={
          openVendorModal
        }

        vendor={
          selectedVendor
        }

        loading={
          saving
        }

        onClose={
          handleCloseModal
        }

        onSubmit={
          handleVendorSubmit
        }
      />


      {/* Vendor Details Modal */}

<VendorDetailsModal
  open={
    openDetailsModal
  }

  vendor={
    detailsVendor
  }

  onClose={() => {
    setOpenDetailsModal(
      false,
    );

    setDetailsVendor(
      null,
    );
  }}
/>

{/* Vendor Category Assignment Modal */}

<VendorCategoryAssignmentModal
  open={
    openCategoryModal
  }

  vendor={
    categoryVendor
  }

  categories={
    vendorCategories
  }

  assignments={
    categoryAssignments
  }

  loading={
    savingCategories ||
    loadingCategoryAssignments ||
    vendorCategoriesLoading
  }

  onClose={
    handleCloseCategoryModal
  }

  onSubmit={
    handleSaveCategories
  }
/>


      {deleting && (
        <div
          style={{
            position:
              "fixed",

            right: 20,
            bottom: 20,

            padding:
              "10px 14px",

            borderRadius:
              8,

            background:
              "#ffffff",

            boxShadow:
              "0 4px 16px rgba(0,0,0,0.12)",

            fontSize:
              13,

            zIndex:
              1000,
          }}
        >
          Deleting vendor...
        </div>
      )}
    </>
  );
};


export default VendorListPage;