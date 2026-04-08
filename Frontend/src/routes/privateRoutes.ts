import Eligibility from "@/pages/private/student/eligibility/Eligibility";
import StudentDashboard from "@/pages/private/student/dashboard/StudentDashboard";
import StudentProfile from "@/pages/private/student/profile/StudentProfile";
import JobListing from "@/pages/private/student/jobs/JobListing";
import type { RouteOptions } from "./type";

export const PrivateRoutes: RouteOptions<any>[] = [
    {
        path: "/student/dashboard",
        component: StudentDashboard,
    },
    {
        path: "/student/profile",
        component: StudentProfile,
    },
    {
        path: "/student/eligibility",
        component: Eligibility,
    },
    {
        path: "/student/jobs",
        component: JobListing,
    },
];