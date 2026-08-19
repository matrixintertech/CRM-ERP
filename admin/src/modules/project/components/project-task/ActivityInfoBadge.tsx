interface Props {
  label: string;
  value: string;
}


const ActivityInfoBadge = ({
  label,
  value,
}: Props) => {
  return (
    <span
      style={{
        padding: "5px 9px",
        border:
          "1px solid #e5e7eb",
        borderRadius: 999,
        background: "#ffffff",
        color: "#374151",
        fontSize: 11,
      }}
    >
      <strong>
        {label}:
      </strong>

      {" "}

      {value}
    </span>
  );
};


export default ActivityInfoBadge;