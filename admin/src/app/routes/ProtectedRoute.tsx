import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../providers/AuthProvider";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

    console.log("ProtectedRoute", {
    isAuthenticated,
    path: window.location.pathname,
  });


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;