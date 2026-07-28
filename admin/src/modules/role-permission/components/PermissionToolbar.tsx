import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";

interface Props {
  roleName?: string;

  search: string;

  onSearchChange: (
    value: string,
  ) => void;

  onBack: () => void;
}

const PermissionToolbar = ({
  roleName,
  search,
  onSearchChange,
  onBack,
}: Props) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center",
        gap: 16,
        marginBottom: 24,
        flexWrap: "wrap",
      }}
    >
      <div>
        <Button
          variant="secondary"
          onClick={onBack}
        >
          Back
        </Button>

        <h2
          style={{
            marginTop: 12,
            marginBottom: 4,
          }}
        >
          {roleName ??
            "Role Permissions"}
        </h2>

        <p
          style={{
            color: "#6b7280",
          }}
        >
          Assign permissions to
          this role.
        </p>
      </div>

      <div
        style={{
          minWidth: 300,
        }}
      >
        <Input
          id="permission-search"
          label=""
          placeholder="Search permission..."
          value={search}
          onChange={(e) =>
            onSearchChange(
              e.target.value,
            )
          }
        />
      </div>
    </div>
  );
};

export default PermissionToolbar;