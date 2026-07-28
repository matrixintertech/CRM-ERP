import { Navigate, Route, Routes } from "react-router-dom";

import {
  publicRoutes,
  protectedRoutes,
} from "@/config/routes.config";

import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
   console.log(protectedRoutes);
  return (
    <Routes>

      
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          {protectedRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>
      </Route>

      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="*"
        element={<div>404 Page Not Found</div>}
      />
    </Routes>
  );
};

export default AppRoutes;