import {
  useState,
} from "react";

import {
  useDocumentTitle,
} from "@/shared/hooks/useDocumentTitle";

import {
  useAuthorization,
} from "@/shared/hooks/useAuthorization";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Eye,
  Plus,
  SquarePen,
  Trash2,
} from "lucide-react";

import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";
import DataTable from "@/shared/components/DataTable/DataTable";
import PageHeader from "@/shared/components/PageHeader";

import type {
  DataTableColumn,
} from "@/shared/components/DataTable/types";

import OrganizationUnitModal from "../components/OrganizationUnitModal";

import {
  useOrganizationUnits,
} from "../hooks/useOrganizationUnits";

import type {
  OrganizationUnit,
  OrganizationUnitFormData,
  UpdateOrganizationUnitDto,
} from "../types/organization-unit.types";


const createDefaultForm = (
  companyUuid?: string,
): OrganizationUnitFormData => ({
  companyUuid,

  parentUuid:
    undefined,

  type:
    "HEAD_OFFICE",

  name:
    "",

  code:
    "",

  email:
    "",

  mobile:
    "",

  addressLine1:
    "",

  addressLine2:
    "",

  stateUuid:
    "",

  cityUuid:
    "",

  country:
    "",

  pincode:
    "",

  status:
    "ACTIVE",
});


const OrganizationUnitPage = () => {
  const navigate =
    useNavigate();


  useDocumentTitle(
    "Organization Units",
  );


  const {
    hasPermission,
  } = useAuthorization();


  const canViewOrganizationUnit =
    hasPermission(
      "company.organization_unit.view",
    );

  const canCreateOrganizationUnit =
    hasPermission(
      "company.organization_unit.create",
    );

  const canUpdateOrganizationUnit =
    hasPermission(
      "company.organization_unit.update",
    );

  const canDeleteOrganizationUnit =
    hasPermission(
      "company.organization_unit.delete",
    );


  const {
    companyId:
      companyUuid,
  } = useParams<{
    companyId: string;
  }>();


  const {
    loading,

    organizationUnits,

    fetchOrganizationUnit,

    create,
    update,
    remove,

    saving,
  } = useOrganizationUnits({
    companyUuid,
  });


  const [
    open,
    setOpen,
  ] = useState(false);


  const [
    editUuid,
    setEditUuid,
  ] = useState<
    string | null
  >(null);


  const [
    formData,
    setFormData,
  ] =
    useState<OrganizationUnitFormData>(
      () =>
        createDefaultForm(
          companyUuid,
        ),
    );


  const resetForm = () => {
    setEditUuid(
      null,
    );

    setFormData(
      createDefaultForm(
        companyUuid,
      ),
    );
  };


  const handleOpenCreate =
    () => {
      if (
        !canCreateOrganizationUnit
      ) {
        return;
      }


      resetForm();

      setOpen(
        true,
      );
    };


  const handleCloseModal =
    () => {
      setOpen(
        false,
      );

      resetForm();
    };


  const handleSubmit =
    async () => {
      /*
       * Frontend UX check only.
       * Backend remains final authority.
       */
      if (
        editUuid &&
        !canUpdateOrganizationUnit
      ) {
        return;
      }


      if (
        !editUuid &&
        !canCreateOrganizationUnit
      ) {
        return;
      }


      try {
        if (editUuid) {
          const payload:
            UpdateOrganizationUnitDto = {
            parentUuid:
              formData.parentUuid,

            type:
              formData.type,

            name:
              formData.name
                ?.trim() ??
              "",

            code:
              formData.code
                ?.trim()
                .toUpperCase()
                .replace(
                  /\s+/g,
                  "",
                ) ??
              "",

            email:
              formData.email
                ?.trim() ??
              "",

            mobile:
              formData.mobile
                ?.trim() ??
              "",

            addressLine1:
              formData.addressLine1
                ?.trim() ??
              "",

            addressLine2:
              formData.addressLine2
                ?.trim() ??
              "",

            stateUuid:
              formData.stateUuid ||
              undefined,

            cityUuid:
              formData.cityUuid ||
              undefined,

            country:
              formData.country
                ?.trim() ??
              "",

            pincode:
              formData.pincode
                ?.trim() ??
              "",

            status:
              formData.status ??
              "ACTIVE",
          };


          await update(
            editUuid,
            payload,
          );
        } else {
          const payload:
            OrganizationUnitFormData = {
            ...formData,

            companyUuid,

            name:
              formData.name
                ?.trim() ??
              "",

            code:
              formData.code
                ?.trim()
                .toUpperCase()
                .replace(
                  /\s+/g,
                  "",
                ) ??
              "",

            email:
              formData.email
                ?.trim() ??
              "",

            mobile:
              formData.mobile
                ?.trim() ??
              "",

            addressLine1:
              formData.addressLine1
                ?.trim() ??
              "",

            addressLine2:
              formData.addressLine2
                ?.trim() ??
              "",

            stateUuid:
              formData.stateUuid ||
              "",

            cityUuid:
              formData.cityUuid ||
              "",

            country:
              formData.country
                ?.trim() ??
              "",

            pincode:
              formData.pincode
                ?.trim() ??
              "",

            status:
              formData.status ??
              "ACTIVE",
          };


          await create(
            payload,
          );
        }


        handleCloseModal();
      } catch (
        error
      ) {
        console.error(
          "Failed to save organization unit:",
          error,
        );
      }
    };


  const handleEdit =
    async (
      uuid: string,
    ) => {
      if (
        !canUpdateOrganizationUnit
      ) {
        return;
      }


      try {
        const unit =
          await fetchOrganizationUnit(
            uuid,
          );


        if (!unit) {
          return;
        }


        setEditUuid(
          uuid,
        );


        setFormData({
          companyUuid,

          parentUuid:
            unit.parent?.uuid,

          type:
            unit.type,

          name:
            unit.name,

          code:
            unit.code,

          email:
            unit.email ??
            "",

          mobile:
            unit.mobile ??
            "",

          addressLine1:
            unit.addressLine1 ??
            "",

          addressLine2:
            unit.addressLine2 ??
            "",

          stateUuid:
            unit.state?.uuid ??
            "",

          cityUuid:
            unit.city?.uuid ??
            "",

          country:
            unit.country ??
            "",

          pincode:
            unit.pincode ??
            "",

          status:
            unit.status,
        });


        setOpen(
          true,
        );
      } catch (
        error
      ) {
        console.error(
          "Failed to load organization unit:",
          error,
        );
      }
    };


  const handleDelete =
    async (
      uuid: string,
    ) => {
      if (
        !canDeleteOrganizationUnit
      ) {
        return;
      }


      const confirmed =
        window.confirm(
          "Are you sure you want to delete this organization unit?",
        );


      if (!confirmed) {
        return;
      }


      try {
        await remove(
          uuid,
        );
      } catch (
        error
      ) {
        console.error(
          "Failed to delete organization unit:",
          error,
        );
      }
    };


  const columns:
    DataTableColumn<OrganizationUnit>[] = [
    {
      key:
        "name",

      title:
        "Organization Unit",
    },

    {
      key:
        "code",

      title:
        "Code",
    },

    {
      key:
        "type",

      title:
        "Type",

      render: (
        row,
      ) =>
        row.type
          .replaceAll(
            "_",
            " ",
          )
          .toLowerCase()
          .replace(
            /\b\w/g,
            (
              character,
            ) =>
              character.toUpperCase(),
          ),
    },

    {
      key:
        "parent",

      title:
        "Parent",

      render: (
        row,
      ) =>
        row.parent
          ?.name ?? "-",
    },

    {
      key:
        "city",

      title:
        "City",

      render: (
        row,
      ) =>
        row.city
          ?.name ?? "-",
    },

    {
      key:
        "state",

      title:
        "State",

      render: (
        row,
      ) =>
        row.state
          ?.name ?? "-",
    },

    {
      key:
        "mobile",

      title:
        "Mobile",

      render: (
        row,
      ) =>
        row.mobile ||
        "-",
    },

    {
      key:
        "status",

      title:
        "Status",

      align:
        "center",
    },

    {
      key:
        "actions",

      title:
        "Actions",

      align:
        "center",

      render: (
        row,
      ) => {
        const hasAnyAction =
          canViewOrganizationUnit ||
          canUpdateOrganizationUnit ||
          canDeleteOrganizationUnit;


        if (!hasAnyAction) {
          return "-";
        }


        return (
          <div
            style={{
              display:
                "flex",

              justifyContent:
                "center",

              gap: 8,
            }}
          >
            {canViewOrganizationUnit && (
              <Button
                size="sm"
                variant="secondary"
                aria-label={`View ${row.name}`}
                title="View Organization Unit"
                onClick={() =>
                  navigate(
                    `/companies/${companyUuid}/organization/${row.uuid}`,
                  )
                }
              >
                <Eye
                  size={16}
                />
              </Button>
            )}


            {canUpdateOrganizationUnit && (
              <Button
                size="sm"
                aria-label={`Edit ${row.name}`}
                title="Edit Organization Unit"
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
            )}


            {canDeleteOrganizationUnit && (
              <Button
                size="sm"
                variant="danger"
                aria-label={`Delete ${row.name}`}
                title="Delete Organization Unit"
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
            )}
          </div>
        );
      },
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
              display:
                "flex",

              gap: 12,
            }}
          >
            <Button
              variant="secondary"
              onClick={() =>
                navigate(
                  "/companies",
                )
              }
            >
              Back
            </Button>


            {canCreateOrganizationUnit && (
              <Button
                onClick={
                  handleOpenCreate
                }
              >
                <Plus
                  size={18}
                />

                Add Unit
              </Button>
            )}
          </div>
        }
      />


      <Card>
        <DataTable
          loading={
            loading
          }
          data={
            organizationUnits
          }
          columns={
            columns
          }
          keyField="uuid"
          showSerialNumber
          emptyMessage="No organization units found."
        />
      </Card>


      {(canCreateOrganizationUnit ||
        canUpdateOrganizationUnit) && (
        <OrganizationUnitModal
          title={
            editUuid
              ? "Edit Organization Unit"
              : "Create Organization Unit"
          }
          isEdit={
            Boolean(
              editUuid,
            )
          }
          open={
            open
          }
          loading={
            saving
          }
          organizationUnits={
            organizationUnits
          }
          formData={
            formData
          }
          setFormData={
            setFormData
          }
          onClose={
            handleCloseModal
          }
          onSubmit={
            handleSubmit
          }
        />
      )}
    </>
  );
};


export default OrganizationUnitPage;