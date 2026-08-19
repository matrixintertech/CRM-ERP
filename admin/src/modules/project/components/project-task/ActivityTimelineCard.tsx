import type {
  ReactNode,
} from "react";


interface Props {
  color: string;
  children: ReactNode;
}


const ActivityTimelineCard = ({
  color,
  children,
}: Props) => {
  return (
    <article
      style={{
        display: "grid",
        gridTemplateColumns:
          "12px minmax(0, 1fr)",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            marginTop: 5,
            borderRadius: "50%",
            background: color,
            flexShrink: 0,
          }}
        />

        <div
          style={{
            width: 1,
            minHeight: 75,
            flex: 1,
            marginTop: 5,
            background: "#e5e7eb",
          }}
        />
      </div>

      <div
        style={{
          padding: "12px 14px",
          border:
            "1px solid #e5e7eb",
          borderRadius: 10,
          background: "#ffffff",
        }}
      >
        {children}
      </div>
    </article>
  );
};


export default ActivityTimelineCard;