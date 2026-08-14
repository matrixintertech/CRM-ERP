import type {
  ReactNode,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import {
  useAuthorization,
} from "@/shared/hooks/useAuthorization";

import type {
  AccessPortal,
} from "@/modules/profile/types/profile.types";


interface Props {
  portal:
    AccessPortal;

  children:
    ReactNode;
}


const PortalRoute = ({
  portal: requiredPortal,
  children,
}: Props) => {
  const {
    profile,
    portal,
    loading,
  } = useAuthorization();


  if (loading) {
    return null;
  }


  if (!profile) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  /*
   * Application portal boundary.
   *
   * PLATFORM user:
   * only PLATFORM routes.
   *
   * COMPANY user:
   * only COMPANY routes.
   *
   * CLIENT / VENDOR:
   * future separate portals.
   */
  if (
    portal !==
    requiredPortal
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }


  return children;
};


export default PortalRoute;