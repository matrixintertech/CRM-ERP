import { useEffect } from "react";

const APP_NAME = "Matrix CRM";

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | ${APP_NAME}`;

    return () => {
      document.title = APP_NAME;
    };
  }, [title]);
};
