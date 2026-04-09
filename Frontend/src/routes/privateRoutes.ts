import Eligibility from "@/pages/private/student/eligibility/Eligibility";
import StudentDashboard from "@/pages/private/student/dashboard/StudentDashboard";
import StudentProfile from "@/pages/private/student/profile/StudentProfile";
import JobListing from "@/pages/private/student/jobs/JobListing";
import ApplicationStatus from "@/pages/private/student/application/Application";
import type { RouteOptions } from "./type";
import Notification from "@/pages/private/student/notification/Notification";
import Documents from "@/pages/private/student/documents/Documents";
import InterviewScheduler from "@/pages/private/student/interview/InterviewScheduler";
import AdminDashboard from "@/pages/private/admin/dashboard/AdminDashboard";
import StudentManagement from "@/pages/private/admin/students/StudentManagement";
import CompanyManagement from "@/pages/private/admin/companies/CompanyManagement";
import PlacementDriveManagement from "@/pages/private/admin/drives/PlacementDriveManagement";

export const PrivateRoutes: RouteOptions<any>[] = [
    // {
    //     path: "/admin/dashboard",
    //     component: AdminDashboard,
    // },
    // {
    //     path: "/admin/students",
    //     component: StudentManagement,
    // },
    // {
    //     path: "/admin/companies",
    //     component: CompanyManagement,
    // },
    // {
    //     path: "/admin/drives",
    //     component: PlacementDriveManagement,
    // },
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
    {
        path: "/student/application",
        component:ApplicationStatus
    },
     {
        path: "/student/notifications",
        component: Notification
    },
     {
        path: "/student/documents",
        component:Documents
    },
    {
        path: "/student/interview",
        component:InterviewScheduler
    }

];