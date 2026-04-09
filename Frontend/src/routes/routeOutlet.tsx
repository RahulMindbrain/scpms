import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/reducers/rootReducer";
import StudentLayout from "@/components/layout/StudentLayout";
import AdminLayout from "@/components/layout/AdminLayout";

const RouteOutlet: React.FC = () => {
    const { isAuthenticated, userType } = useSelector(
        (state: RootState) => state.auth
    );

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (userType === "admin") {
        return <AdminLayout />;
    }

    return <StudentLayout />;
};

export default RouteOutlet;