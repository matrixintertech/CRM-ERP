import type {
  ReactNode,
} from "react";

import {
  Building2,
  CircleCheck,
  Globe,
  Mail,
  MapPin,
  Phone,
  Tags,
} from "lucide-react";

import Modal from "@/shared/components/Modal";
import Badge from "@/shared/components/Badge";
import Button from "@/shared/components/Button";

import type {
  Vendor,
  VendorServiceArea,
} from "../types/vendor.types";

import styles from "./VendorDetailsModal.module.css";


interface Props {
  open: boolean;

  vendor:
    Vendor | null;

  loading?: boolean;

  onClose:
    () => void;
}


/*
 * =========================================================
 * LABEL HELPERS
 * =========================================================
 */

const formatSource = (
  value: string,
) => {
  const labels:
    Record<
      string,
      string
    > = {
    SELF_REGISTRATION:
      "Self Registration",

    COMPANY_INVITE:
      "Company Invite",

    PLATFORM_CREATED:
      "Platform Created",
  };


  return (
    labels[value] ??
    value.replace(
      /_/g,
      " ",
    )
  );
};


const formatServiceArea = (
  area:
    VendorServiceArea,
) => {
  switch (
    area.type
  ) {
    case "NATIONAL":
      return "National";

    case "STATE":
      return (
        area.state
          ?.name ??
        "State"
      );

    case "CITY":
      return (
        [
          area.city
            ?.name,

          area.state
            ?.name,
        ]
          .filter(
            Boolean,
          )
          .join(
            ", ",
          ) ||
        "City"
      );

    case "PINCODE":
      return (
        area.pincode ??
        "Pincode"
      );

    case "RADIUS":
      return `${
        area.radiusKm ??
        "-"
      } km radius`;

    default:
      return area.type;
  }
};


/*
 * =========================================================
 * INFO ITEM
 * =========================================================
 */

interface InfoItemProps {
  label: string;

  value:
    ReactNode;
}


const InfoItem = ({
  label,
  value,
}: InfoItemProps) => {
  return (
    <div
      className={
        styles.infoItem
      }
    >
      <div
        className={
          styles.infoLabel
        }
      >
        {label}
      </div>

      <div
        className={
          styles.infoValue
        }
      >
        {value || "-"}
      </div>
    </div>
  );
};


/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

const VendorDetailsModal = ({
  open,
  vendor,
  loading = false,
  onClose,
}: Props) => {
  const primaryCategory =
    vendor
      ?.categories
      ?.find(
        (item) =>
          item.isPrimary,
      );


  return (
    <Modal
      open={
        open
      }
      title="Vendor Details"
      onClose={
        onClose
      }
      size="lg"
    >
      {loading ? (
        <div
          className={
            styles.stateMessage
          }
        >
          Loading vendor details...
        </div>
      ) : !vendor ? (
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
           * HEADER
           * =====================================================
           */}

          <section
            className={
              styles.vendorHeader
            }
          >
            <div
              className={
                styles.headerContent
              }
            >
              <div
                className={
                  styles.vendorIdentity
                }
              >
                <div
                  className={
                    styles.vendorIcon
                  }
                >
                  <Building2
                    size={20}
                  />
                </div>


                <div
                  className={
                    styles.vendorMain
                  }
                >
                  <div
                    className={
                      styles.vendorName
                    }
                  >
                    {
                      vendor.legalName
                    }
                  </div>


                  {vendor.displayName &&
                    vendor.displayName !==
                      vendor.legalName && (
                      <div
                        className={
                          styles.displayName
                        }
                      >
                        {
                          vendor.displayName
                        }
                      </div>
                    )}


                  <div
                    className={
                      styles.badges
                    }
                  >
                    <Badge
                      status={
                        vendor.status
                      }
                    />

                    <Badge
                      status={
                        vendor.marketplaceStatus
                      }
                    />

                    <Badge
                      status={
                        vendor.isVerified
                          ? "VERIFIED"
                          : "NOT_VERIFIED"
                      }
                    />
                  </div>
                </div>
              </div>


              {vendor.isVerified && (
                <div
                  className={
                    styles.verified
                  }
                >
                  <CircleCheck
                    size={17}
                  />

                  Verified Vendor
                </div>
              )}
            </div>
          </section>


          {/*
           * =====================================================
           * BUSINESS INFORMATION
           * =====================================================
           */}

          <section>
            <h4
              className={
                styles.sectionTitle
              }
            >
              Business Information
            </h4>


            <div
              className={
                styles.infoGrid
              }
            >
              <InfoItem
                label="Legal Name"
                value={
                  vendor.legalName
                }
              />

              <InfoItem
                label="Display Name"
                value={
                  vendor.displayName
                }
              />

              <InfoItem
                label="PAN Number"
                value={
                  vendor.panNumber
                }
              />

              <InfoItem
                label="Primary GST Number"
                value={
                  vendor.primaryGstNumber
                }
              />

              <InfoItem
                label="Onboarding Source"
                value={
                  formatSource(
                    vendor.onboardingSource,
                  )
                }
              />

              <InfoItem
                label="Primary Category"
                value={
                  primaryCategory
                    ?.category
                    .name
                }
              />
            </div>
          </section>


          <div
            className={
              styles.divider
            }
          />


          {/*
           * =====================================================
           * CONTACT INFORMATION
           * =====================================================
           */}

          <section>
            <h4
              className={
                styles.sectionTitle
              }
            >
              Contact Information
            </h4>


            <div
              className={
                styles.infoGrid
              }
            >
              <InfoItem
                label="Email"
                value={
                  vendor.email ? (
                    <div
                      className={
                        styles.iconValue
                      }
                    >
                      <Mail
                        size={15}
                      />

                      {
                        vendor.email
                      }
                    </div>
                  ) : (
                    "-"
                  )
                }
              />


              <InfoItem
                label="Mobile"
                value={
                  vendor.mobile ? (
                    <div
                      className={
                        styles.iconValue
                      }
                    >
                      <Phone
                        size={15}
                      />

                      {
                        vendor.mobile
                      }
                    </div>
                  ) : (
                    "-"
                  )
                }
              />


              <InfoItem
                label="Website"
                value={
                  vendor.website ? (
                    <a
                      href={
                        vendor.website.startsWith(
                          "http",
                        )
                          ? vendor.website
                          : `https://${vendor.website}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className={
                        styles.websiteLink
                      }
                    >
                      <Globe
                        size={15}
                      />

                      {
                        vendor.website
                      }
                    </a>
                  ) : (
                    "-"
                  )
                }
              />


              <InfoItem
                label="Pincode"
                value={
                  vendor.pincode
                }
              />
            </div>
          </section>


          <div
            className={
              styles.divider
            }
          />


          {/*
           * =====================================================
           * ADDRESS
           * =====================================================
           */}

          <section>
            <h4
              className={
                styles.sectionTitle
              }
            >
              Address
            </h4>


            <div
              className={
                styles.addressCard
              }
            >
              <MapPin
                size={18}
                className={
                  styles.cardIcon
                }
              />

              <div
                className={
                  styles.addressText
                }
              >
                {
                  vendor.address ||
                  "No address added."
                }

                {vendor.pincode && (
                  <div
                    className={
                      styles.addressMeta
                    }
                  >
                    Pincode:{" "}
                    {
                      vendor.pincode
                    }
                  </div>
                )}
              </div>
            </div>
          </section>


          {/*
           * =====================================================
           * CATEGORIES
           * =====================================================
           */}

          <section>
            <h4
              className={
                styles.sectionTitleIcon
              }
            >
              <Tags
                size={16}
              />

              Vendor Categories
            </h4>


            {!vendor.categories ||
            vendor.categories.length ===
              0 ? (
              <div
                className={
                  styles.emptyCard
                }
              >
                No categories assigned.
              </div>
            ) : (
              <div
                className={
                  styles.cardGrid
                }
              >
                {vendor.categories.map(
                  (
                    item,
                  ) => (
                    <div
                      key={
                        item.category
                          .uuid
                      }
                      className={
                        styles.tagCard
                      }
                    >
                      <div
                        className={
                          styles.tagName
                        }
                      >
                        {
                          item.category
                            .name
                        }

                        {item.isPrimary && (
                          <span
                            className={
                              styles.primaryLabel
                            }
                          >
                            Primary
                          </span>
                        )}
                      </div>

                      <div
                        className={
                          styles.tagCode
                        }
                      >
                        {
                          item.category
                            .code
                        }
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </section>


          {/*
           * =====================================================
           * SERVICE AREAS
           * =====================================================
           */}

          {vendor.serviceAreas &&
            vendor.serviceAreas.length >
              0 && (
              <section>
                <h4
                  className={
                    styles.sectionTitleIcon
                  }
                >
                  <MapPin
                    size={16}
                  />

                  Service Areas
                </h4>


                <div
                  className={
                    styles.cardGrid
                  }
                >
                  {vendor.serviceAreas.map(
                    (
                      area,
                    ) => (
                      <div
                        key={
                          area.uuid
                        }
                        className={
                          styles.serviceCard
                        }
                      >
                        <div
                          className={
                            styles.tagName
                          }
                        >
                          {
                            formatServiceArea(
                              area,
                            )
                          }
                        </div>

                        <div
                          className={
                            styles.tagCode
                          }
                        >
                          {
                            area.type.replace(
                              /_/g,
                              " ",
                            )
                          }
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </section>
            )}


          {/*
           * =====================================================
           * REMARKS
           * =====================================================
           */}

          {vendor.remarks && (
            <>
              <div
                className={
                  styles.divider
                }
              />

              <section>
                <h4
                  className={
                    styles.sectionTitle
                  }
                >
                  Remarks
                </h4>

                <div
                  className={
                    styles.remarks
                  }
                >
                  {
                    vendor.remarks
                  }
                </div>
              </section>
            </>
          )}


          {/*
           * =====================================================
           * SYSTEM INFORMATION
           * =====================================================
           */}

          <div
            className={
              styles.divider
            }
          />


          <section>
            <h4
              className={
                styles.sectionTitle
              }
            >
              System Information
            </h4>


            <div
              className={
                styles.infoGrid
              }
            >
              <InfoItem
                label="Created At"
                value={
                  new Date(
                    vendor.createdAt,
                  ).toLocaleString(
                    "en-IN",
                  )
                }
              />

              <InfoItem
                label="Last Updated"
                value={
                  new Date(
                    vendor.updatedAt,
                  ).toLocaleString(
                    "en-IN",
                  )
                }
              />

              {vendor.verifiedAt && (
                <InfoItem
                  label="Verified At"
                  value={
                    new Date(
                      vendor.verifiedAt,
                    ).toLocaleString(
                      "en-IN",
                    )
                  }
                />
              )}
            </div>
          </section>


          {/*
           * =====================================================
           * FOOTER
           * =====================================================
           */}

          <div
            className={
              styles.footer
            }
          >
            <Button
              type="button"
              variant="secondary"
              onClick={
                onClose
              }
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};


export default VendorDetailsModal;