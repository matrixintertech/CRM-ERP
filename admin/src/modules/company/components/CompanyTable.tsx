import { useNavigate } from "react-router-dom";

import {
  useAuthorization,
} from "@/shared/hooks/useAuthorization";

import Badge from "@/shared/components/Badge";
import Button from "@/shared/components/Button";
import Table, {
  type Column,
} from "@/shared/components/Table";


interface Company {
  id: string;

  name: string;

  code: string;

  email: string;

  mobile: string;

  status: string;
}


interface Props {
  data: Company[];

  loading: boolean;

  onView: (
    id: string,
  ) => void;

  onOrganization: (
    id: string,
  ) => void;

  onRoles: (
    id: string,
  ) => void;
}


const CompanyTable = ({
  data,
  loading,
  onView,
  onOrganization,
  onRoles,
}: Props) => {
  const navigate =
    useNavigate();


  const {
    hasPermission,
  } = useAuthorization();


  const canViewCompany =
    hasPermission(
      "platform.company.view",
    );

  const canUpdateCompany =
    hasPermission(
      "platform.company.update",
    );


  /*
   * Organization and Roles are
   * currently treated as company
   * management/configuration.
   *
   * Dedicated platform permissions
   * can be introduced later.
   */
  const canManageCompany =
    canUpdateCompany;


  const handleEdit = (
    id: string,
  ) => {
    if (
      !canUpdateCompany
    ) {
      return;
    }

    navigate(
      `/companies/create?id=${id}`,
    );
  };


  const handleView = (
    id: string,
  ) => {
    if (
      !canViewCompany
    ) {
      return;
    }

    onView(
      id,
    );
  };


  const handleOrganization = (
    id: string,
  ) => {
    if (
      !canManageCompany
    ) {
      return;
    }

    onOrganization(
      id,
    );
  };


  const handleRoles = (
    id: string,
  ) => {
    if (
      !canManageCompany
    ) {
      return;
    }

    onRoles(
      id,
    );
  };


  const hasActions =
    canViewCompany ||
    canUpdateCompany ||
    canManageCompany;


  const columns:
    Column<Company>[] = [
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
      },

      {
        key:
          "mobile",

        title:
          "Mobile",
      },

      {
        key:
          "status",

        title:
          "Status",

        render:
          (value) => (
            <Badge
              status={
                String(
                  value,
                )
              }
            />
          ),
      },

      ...(hasActions
        ? [
            {
              key:
                "action",

              title:
                "Action",

              render: (
                _value: unknown,
                row: Company,
              ) => (
                <div
                  style={{
                    display:
                      "flex",

                    gap: 8,

                    flexWrap:
                      "wrap",
                  }}
                >
                  {canViewCompany && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        handleView(
                          row.id,
                        )
                      }
                    >
                      View
                    </Button>
                  )}


                  {canUpdateCompany && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleEdit(
                          row.id,
                        )
                      }
                    >
                      Edit
                    </Button>
                  )}


                  {canManageCompany && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() =>
                        handleOrganization(
                          row.id,
                        )
                      }
                    >
                      Organization
                    </Button>
                  )}


                  {canManageCompany && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() =>
                        handleRoles(
                          row.id,
                        )
                      }
                    >
                      Roles
                    </Button>
                  )}
                </div>
              ),
            } as Column<Company>,
          ]
        : []),
    ];


  return (
    <Table
      columns={
        columns
      }
      data={
        data
      }
      loading={
        loading
      }
    />
  );
};


export default CompanyTable;