interface Props {
  label: string;
  color: string;
  background: string;
}


const ActivityLabel = ({
  label,
  color,
  background,
}: Props) => {
  return (
    <span
      style={{
        padding: "4px 8px",
        borderRadius: 999,
        background,
        color,
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      {label}
    </span>
  );
};


export default ActivityLabel;