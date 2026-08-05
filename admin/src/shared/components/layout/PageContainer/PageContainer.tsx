import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const PageContainer = ({
  children,
}: Props) => {
  return <main>{children}</main>;
};

export default PageContainer;