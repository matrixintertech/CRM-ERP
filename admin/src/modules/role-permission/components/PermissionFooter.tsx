import Button from "@/shared/components/Button";

interface Props {
  loading: boolean;

  selectedCount: number;

  onReset: () => void;

  onSave: () => void;
}

const PermissionFooter = ({
  loading,
  selectedCount,
  onReset,
  onSave,
}: Props) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center",
        marginTop: 32,
        paddingTop: 20,
        borderTop:
          "1px solid #e5e7eb",
      }}
    >
      <div>
        <strong>
          Selected:
        </strong>{" "}
        {selectedCount}
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
        }}
      >
        <Button
          variant="secondary"
          onClick={onReset}
        >
          Reset
        </Button>

        <Button
          loading={loading}
          onClick={onSave}
        >
          Save Permissions
        </Button>
      </div>
    </div>
  );
};

export default PermissionFooter;