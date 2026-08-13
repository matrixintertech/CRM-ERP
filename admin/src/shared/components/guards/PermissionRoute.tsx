import type {
  ReactNode,
} from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  useAuthorization,
} from "@/shared/hooks/useAuthorization";


interface PermissionRouteProps {
  permission: string;

  children: ReactNode;

  redirectTo?: string;
}


const PermissionRoute = ({
  permission,
  children,
  redirectTo = "/dashboard",
}: PermissionRouteProps) => {
  const location =
    useLocation();

  const {
    loading,
    hasPermission,
  } = useAuthorization();


  /*
   * Profile load hone se pehle
   * authorization decision mat lo.
   *
   * Otherwise page refresh par
   * temporary false permission ki wajah
   * se unwanted redirect ho sakta hai.
   */
  if (loading) {
    return null;
  }


  if (
    !hasPermission(
      permission,
    )
  ) {
    return (
      <Navigate
        to={
          redirectTo
        }
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }


  return (
    <>
      {children}
    </>
  );
};


export default PermissionRoute;