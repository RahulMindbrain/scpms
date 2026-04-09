import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/reducers/rootReducer";
import StudentLayout from "@/components/layout/StudentLayout";

const RouteOutlet: React.FC = () => {
    const isAuthenticate = useSelector(
        (state: RootState) => state.auth.isAuthenticated
    );

    return isAuthenticate ? (
        <StudentLayout />
    ) : (
        <Navigate to={`/login`} replace />
    );
};

export default RouteOutlet;