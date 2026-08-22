import {
  Eye,
  SquarePen,
  Tags,
  Trash2,
} from "lucide-react";

import Badge from "@/shared/components/Badge";
import Button from "@/shared/components/Button";

import Table, {
  type Column,
} from "@/shared/components/Table";

import type {
  Vendor,
} from "../types/vendor.types";


interface Props {
  data:
    Vendor[];

  loading:
    boolean;

  canView?:
    boolean;

  canEdit?:
    boolean;

  canDelete?:
    boolean;

  canManageCategories?:
    boolean;

  onView: (
    vendorUuid: string,
  ) => void;

  onEdit: (
    vendorUuid: string,
  ) => void;

  onDelete: (
    vendorUuid: string,
  ) => void;

  onManageCategories?: (
    vendor: Vendor,
  ) => void;
}


const getPrimaryCategory = (
  vendor: Vendor,
) => {
  const primary =
    vendor.categories?.find(
      (item) =>
        item.isPrimary,
    );

  return (
    primary?.category
      ?.name ??
    "-"
  );
};


const VendorTable = ({
  data,
  loading,

  canView = true,
  canEdit = true,
  canDelete = true,
  canManageCategories = true,

  onView,
  onEdit,
  onDelete,
  onManageCategories,
}: Props) => {
  const columns:
    Column<Vendor>[] = [
    {
      key: "legalName",
      title: "Vendor Name",

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

          {row.displayName &&
            row.displayName !==
              row.legalName && (
              <div className="mt-1 text-xs text-gray-500">
                {
                  row.displayName
                }
              </div>
            )}
        </div>
      ),
    },

    {
      key: "primaryGstNumber",
      title: "GST / PAN",

      render: (
        _value,
        row,
      ) => (
        <div className="space-y-1">
          <div className="text-sm text-gray-800">
            {row.primaryGstNumber ||
              "-"}
          </div>

          {row.panNumber && (
            <div className="text-xs text-gray-500">
              PAN:{" "}
              {
                row.panNumber
              }
            </div>
          )}
        </div>
      ),
    },

    {
      key: "email",
      title: "Contact",

      render: (
        _value,
        row,
      ) => (
        <div className="space-y-1">
          <div className="text-sm">
            {row.mobile ||
              "-"}
          </div>

          {row.email && (
            <div className="text-xs text-gray-500">
              {
                row.email
              }
            </div>
          )}
        </div>
      ),
    },

    {
      key: "categories",
      title: "Primary Category",

      render: (
        _value,
        row,
      ) => (
        <span className="text-sm">
          {getPrimaryCategory(
            row,
          )}
        </span>
      ),
    },

    {
      key: "onboardingSource",
      title: "Source",

      render: (
        value,
      ) => {
        const source =
          String(
            value ?? "",
          );

        const labels:
          Record<
            string,
            string
          > = {
          SELF_REGISTRATION:
            "Self Registered",

          COMPANY_INVITE:
            "Company Invite",

          PLATFORM_CREATED:
            "Platform",
        };

        return (
          <span className="text-sm">
            {labels[
              source
            ] ?? source}
          </span>
        );
      },
    },

    {
      key: "status",
      title: "Status",

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

    {
      key: "marketplaceStatus",
      title: "Marketplace",

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

    {
      key: "isVerified",
      title: "Verified",

      render: (
        value,
      ) => (
        <Badge
          status={
            value
              ? "VERIFIED"
              : "NOT_VERIFIED"
          }
        />
      ),
    },

    {
      key: "action",
      title: "Action",

      render: (
        _value,
        row,
      ) => (
        <div className="flex items-center gap-2">
          {canView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                onView(
                  row.uuid,
                )
              }
              title="View Vendor"
            >
              <Eye
                size={16}
              />
            </Button>
          )}

          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                onEdit(
                  row.uuid,
                )
              }
              title="Edit Vendor"
            >
              <SquarePen
                size={16}
              />
            </Button>
          )}

          {canManageCategories &&
            onManageCategories && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onManageCategories(
                    row,
                  )
                }
                title="Manage Categories"
              >
                <Tags
                  size={16}
                />
              </Button>
            )}

          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                onDelete(
                  row.uuid,
                )
              }
              title="Delete Vendor"
            >
              <Trash2
                size={16}
              />
            </Button>
          )}
        </div>
      ),
    },
  ];


  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
    />
  );
};


export default VendorTable;