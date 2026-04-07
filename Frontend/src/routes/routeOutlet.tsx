import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/reducers/rootReducer";

const RouteOutlet: React.FC = () => {
    const isAuthenticate = useSelector(
        (state: RootState) => state.auth.isAuthenticated
    );

    return isAuthenticate ? (
        // <Layout>
        <Outlet />
        // </Layout>
    ) : (
        <Navigate to={`/`} />
    );
};

export default RouteOutlet;