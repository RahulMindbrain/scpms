import Homepage from "@/pages/public/homepage/homepage";
import type { RouteOptions } from "./type";
import NotFound from "@/pages/public/notFound/notFound";

export const PublicRoutes: RouteOptions<any>[] = [
    {
        path: "/",
        component: Homepage,
    },
    {
        path: "*",
        component: NotFound,
    },
];