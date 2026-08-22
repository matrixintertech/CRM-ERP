import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";

import type {
  UpdateVendorCategoriesDto,
  Vendor,
  VendorCategoryAssignment,
  VendorCategorySummary,
} from "../types/vendor.types";

import styles from "./VendorCategoryAssignmentModal.module.css";


interface Props {
  open: boolean;

  vendor:
    Vendor | null;

  categories:
    VendorCategorySummary[];

  assignments:
    VendorCategoryAssignment[];

  loading?: boolean;

  onClose:
    () => void;

  onSubmit: (
    data:
      UpdateVendorCategoriesDto,
  ) => Promise<void>;
}


const VendorCategoryAssignmentModal = ({
  open,
  vendor,
  categories,
  assignments,
  loading = false,
  onClose,
  onSubmit,
}: Props) => {
  const [
    search,
    setSearch,
  ] = useState("");


  const [
    selectedCategoryUuids,
    setSelectedCategoryUuids,
  ] = useState<string[]>(
    [],
  );


  const [
    primaryCategoryUuid,
    setPrimaryCategoryUuid,
  ] = useState("");


  /*
   * =========================================================
   * INITIALIZE EXISTING ASSIGNMENTS
   * =========================================================
   */

  useEffect(() => {
    if (!open) {
      return;
    }


    const selected =
      assignments.map(
        (assignment) =>
          assignment
            .category
            .uuid,
      );


    const primary =
      assignments.find(
        (assignment) =>
          assignment.isPrimary,
      );


    setSelectedCategoryUuids(
      selected,
    );

    setPrimaryCategoryUuid(
      primary
        ?.category
        .uuid ??
        "",
    );

    setSearch(
      "",
    );
  }, [
    open,
    vendor?.uuid,
    assignments,
  ]);


  /*
   * =========================================================
   * ACTIVE CATEGORIES
   * =========================================================
   */

  const activeCategories =
    useMemo(
      () =>
        categories.filter(
          (category) =>
            category.status ===
            "ACTIVE",
        ),
      [
        categories,
      ],
    );


  /*
   * =========================================================
   * SEARCH
   * =========================================================
   */

  const filteredCategories =
    useMemo(
      () => {
        const normalizedSearch =
          search
            .trim()
            .toLowerCase();


        if (
          !normalizedSearch
        ) {
          return activeCategories;
        }


        return activeCategories.filter(
          (category) =>
            category.name
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            category.code
              .toLowerCase()
              .includes(
                normalizedSearch,
              ),
        );
      },
      [
        activeCategories,
        search,
      ],
    );


  /*
   * =========================================================
   * SELECT / UNSELECT
   * =========================================================
   */

  const handleCategoryChange =
    (
      categoryUuid:
        string,
    ) => {
      setSelectedCategoryUuids(
        (previous) => {
          const alreadySelected =
            previous.includes(
              categoryUuid,
            );


          if (
            alreadySelected
          ) {
            const next =
              previous.filter(
                (uuid) =>
                  uuid !==
                  categoryUuid,
              );


            if (
              primaryCategoryUuid ===
              categoryUuid
            ) {
              setPrimaryCategoryUuid(
                next[0] ??
                  "",
              );
            }


            return next;
          }


          const next = [
            ...previous,
            categoryUuid,
          ];


          if (
            !primaryCategoryUuid
          ) {
            setPrimaryCategoryUuid(
              categoryUuid,
            );
          }


          return next;
        },
      );
    };


  /*
   * =========================================================
   * PRIMARY CATEGORY
   * =========================================================
   */

  const handlePrimaryChange =
    (
      categoryUuid:
        string,
    ) => {
      if (
        !selectedCategoryUuids.includes(
          categoryUuid,
        )
      ) {
        return;
      }


      setPrimaryCategoryUuid(
        categoryUuid,
      );
    };


  /*
   * =========================================================
   * VALIDATION
   * =========================================================
   */

  const canSubmit =
    Boolean(
      vendor &&
        selectedCategoryUuids.length >
          0 &&
        primaryCategoryUuid &&
        selectedCategoryUuids.includes(
          primaryCategoryUuid,
        ),
    ) &&
    !loading;


  /*
   * =========================================================
   * SUBMIT
   * =========================================================
   */

  const handleSubmit =
    async () => {
      if (
        !canSubmit
      ) {
        return;
      }


      const payload:
        UpdateVendorCategoriesDto = {
        categories:
          selectedCategoryUuids.map(
            (
              categoryUuid,
            ) => ({
              categoryUuid,
            }),
          ),

        primaryCategoryUuid,
      };


      await onSubmit(
        payload,
      );
    };


  /*
   * =========================================================
   * CLOSE
   * =========================================================
   */

  const handleClose =
    () => {
      if (loading) {
        return;
      }


      setSearch(
        "",
      );

      setSelectedCategoryUuids(
        [],
      );

      setPrimaryCategoryUuid(
        "",
      );

      onClose();
    };


  /*
   * =========================================================
   * SELECTED CATEGORIES
   * =========================================================
   */

  const selectedCategories =
    activeCategories.filter(
      (category) =>
        selectedCategoryUuids.includes(
          category.uuid,
        ),
    );


  return (
    <Modal
      open={
        open
      }
      title="Vendor Categories"
      onClose={
        handleClose
      }
      size="lg"
    >
      {!vendor ? (
        <div
          className={
            styles.stateMessage
          }
        >
          Vendor information is not available.
        </div>
      ) : (
        <div
          className={
            styles.container
          }
        >
          {/*
           * =====================================================
           * VENDOR SUMMARY
           * =====================================================
           */}

          <section
            className={
              styles.vendorSummary
            }
          >
            <div
              className={
                styles.summaryLabel
              }
            >
              Vendor
            </div>

            <div
              className={
                styles.vendorName
              }
            >
              {
                vendor.displayName ||
                vendor.legalName
              }
            </div>

            {vendor.displayName &&
              vendor.displayName !==
                vendor.legalName && (
                <div
                  className={
                    styles.legalName
                  }
                >
                  {
                    vendor.legalName
                  }
                </div>
              )}
          </section>


          {/*
           * =====================================================
           * SEARCH
           * =====================================================
           */}

          <Input
            label="Search Categories"
            name="categorySearch"
            placeholder="Search by category name or code"
            value={
              search
            }
            disabled={
              loading
            }
            onChange={(
              event,
            ) =>
              setSearch(
                event.target.value,
              )
            }
          />


          {/*
           * =====================================================
           * AVAILABLE CATEGORIES
           * =====================================================
           */}

          <section>
            <div
              className={
                styles.sectionHeader
              }
            >
              <div>
                <h4
                  className={
                    styles.sectionTitle
                  }
                >
                  Available Categories
                </h4>

                <p
                  className={
                    styles.sectionDescription
                  }
                >
                  Select one or more categories applicable to this vendor.
                </p>
              </div>


              <div
                className={
                  styles.selectedCount
                }
              >
                {
                  selectedCategoryUuids.length
                }{" "}
                selected
              </div>
            </div>


            <div
              className={
                styles.categoryList
              }
            >
              {filteredCategories.length ===
              0 ? (
                <div
                  className={
                    styles.emptyState
                  }
                >
                  No active categories found.
                </div>
              ) : (
                filteredCategories.map(
                  (
                    category,
                  ) => {
                    const selected =
                      selectedCategoryUuids.includes(
                        category.uuid,
                      );


                    const primary =
                      primaryCategoryUuid ===
                      category.uuid;


                    return (
                      <div
                        key={
                          category.uuid
                        }
                        className={`${styles.categoryRow} ${
                          selected
                            ? styles.categoryRowSelected
                            : ""
                        }`}
                      >
                        {/*
                         * Select checkbox
                         */}

                        <input
                          type="checkbox"
                          checked={
                            selected
                          }
                          disabled={
                            loading
                          }
                          onChange={() =>
                            handleCategoryChange(
                              category.uuid,
                            )
                          }
                          className={
                            styles.checkbox
                          }
                        />


                        {/*
                         * Category content
                         */}

                        <button
                          type="button"
                          disabled={
                            loading
                          }
                          onClick={() =>
                            handleCategoryChange(
                              category.uuid,
                            )
                          }
                          className={
                            styles.categoryButton
                          }
                        >
                          <div
                            className={
                              styles.categoryName
                            }
                          >
                            {
                              category.name
                            }
                          </div>


                          <div
                            className={
                              styles.categoryMeta
                            }
                          >
                            <span>
                              {
                                category.code
                              }
                            </span>

                            {category.description && (
                              <>
                                <span
                                  className={
                                    styles.metaSeparator
                                  }
                                >
                                  •
                                </span>

                                <span>
                                  {
                                    category.description
                                  }
                                </span>
                              </>
                            )}
                          </div>
                        </button>


                        {/*
                         * Primary selector
                         */}

                        <label
                          className={`${styles.primaryOption} ${
                            selected
                              ? styles.primaryEnabled
                              : styles.primaryDisabled
                          }`}
                        >
                          <input
                            type="radio"
                            name="primaryVendorCategory"
                            checked={
                              primary
                            }
                            disabled={
                              !selected ||
                              loading
                            }
                            onChange={() =>
                              handlePrimaryChange(
                                category.uuid,
                              )
                            }
                            className={
                              styles.radio
                            }
                          />

                          <span>
                            Primary
                          </span>
                        </label>
                      </div>
                    );
                  },
                )
              )}
            </div>
          </section>


          {/*
           * =====================================================
           * SELECTED SUMMARY
           * =====================================================
           */}

          {selectedCategories.length >
            0 && (
            <section>
              <h4
                className={
                  styles.sectionTitle
                }
              >
                Selected Categories
              </h4>


              <div
                className={
                  styles.selectedGrid
                }
              >
                {selectedCategories.map(
                  (
                    category,
                  ) => {
                    const isPrimary =
                      primaryCategoryUuid ===
                      category.uuid;


                    return (
                      <div
                        key={
                          category.uuid
                        }
                        className={`${styles.selectedCard} ${
                          isPrimary
                            ? styles.primaryCard
                            : ""
                        }`}
                      >
                        <div
                          className={
                            styles.selectedCardHeader
                          }
                        >
                          <span
                            className={
                              styles.selectedName
                            }
                          >
                            {
                              category.name
                            }
                          </span>


                          {isPrimary && (
                            <span
                              className={
                                styles.primaryBadge
                              }
                            >
                              Primary
                            </span>
                          )}
                        </div>


                        <div
                          className={
                            styles.selectedCode
                          }
                        >
                          {
                            category.code
                          }
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </section>
          )}


          {/*
           * =====================================================
           * VALIDATION
           * =====================================================
           */}

          {selectedCategoryUuids.length >
            0 &&
            !primaryCategoryUuid && (
              <div
                className={
                  styles.warningMessage
                }
              >
                Please select a primary category.
              </div>
            )}


          {selectedCategoryUuids.length ===
            0 && (
            <div
              className={
                styles.infoMessage
              }
            >
              At least one category must be selected.
            </div>
          )}


          {/*
           * =====================================================
           * ACTIONS
           * =====================================================
           */}

          <div
            className={
              styles.actions
            }
          >
            <Button
              type="button"
              variant="secondary"
              disabled={
                loading
              }
              onClick={
                handleClose
              }
            >
              Cancel
            </Button>


            <Button
              type="button"
              loading={
                loading
              }
              disabled={
                !canSubmit
              }
              onClick={
                handleSubmit
              }
            >
              Save Categories
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};


export default VendorCategoryAssignmentModal;