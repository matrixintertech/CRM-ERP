import { useNavigate } from "react-router-dom";

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
  onView: (id: string) => void;
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
  const navigate = useNavigate();

 const columns: Column<Company>[] = [
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
  },
  {
    key: "mobile",
    title: "Mobile",
  },
  {
    key: "status",
    title: "Status",
    render: (value) => (
      <Badge status={String(value)} />
    ),
  },
  {
    key: "action",
    title: "Action",
    render: (_, row) => (
      <div
        style={{
          display: "flex",
          gap: 8,
        }}
      >
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            onView(row.id)
          }
        >
          View
        </Button>

        <Button
          size="sm"
          onClick={() =>
            navigate(
              `/companies/create?id=${row.id}`,
            )
          }
        >
          Edit
        </Button>
    <Button
      size="sm"
      variant="success"
      onClick={() =>
        onOrganization(row.id)
      }
    >
      Organization
    </Button>

    <Button
  size="sm"
  variant="primary"
  onClick={() =>
    onRoles(row.id)
  }
>
  Roles
</Button>
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

export default CompanyTable;