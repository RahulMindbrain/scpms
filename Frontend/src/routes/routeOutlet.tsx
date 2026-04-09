import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/reducers/rootReducer";
import StudentLayout from "@/components/layout/StudentLayout";
import AdminLayout from "@/components/layout/AdminLayout";

const RouteOutlet: React.FC = () => {
     const location = useLocation();
    const { isAuthenticated, userType } = useSelector(
        (state: RootState) => state.auth
    );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🔥 Check route path
  if (location.pathname.startsWith("/student")) {
    return <StudentLayout />;
  }

  if (location.pathname.startsWith("/admin")) {
    return <AdminLayout />;
  }

  return <Navigate to="/login" replace />;
};

export default RouteOutlet;