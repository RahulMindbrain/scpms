import Homepage from "@/pages/public/homepage/homepage";
import type { RouteOptions } from "./type";
import NotFound from "@/pages/public/notFound/notFound";
import SignUp from "@/pages/public/signup/signup";

export const PublicRoutes: RouteOptions<any>[] = [
    {
        path: "/",
        component: Homepage,
    },
    {
        path: "/signup",
        component: SignUp,
    },
    {
        path: "*",
        component: NotFound,
    },
];
