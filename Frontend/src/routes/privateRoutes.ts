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
import Report from "@/pages/private/admin/report/report"
import AdminNotificationPage from "@/pages/private/admin/notification/notification";
import Setting from "@/pages/private/admin/setting/Setting"
import ApplicationsManagement from "@/pages/private/admin/applications/ApplicationsManagement";
import Shortlisting from "@/pages/private/admin/shortlisting/Shortlisting";
import InterviewSchedulerPage from "@/pages/private/admin/interview/InterviewScheduler";
import BulkEmail from "@/pages/private/admin/email/BulkEmail";
import DocumentManagement from "@/pages/private/admin/documents/DocumentManagement";
import AdminJobManagement from "@/pages/private/admin/jobs/JobManagement";
import CompanyDashboard from "@/pages/private/company/dashboard/Dashboard";
import PostJob from "@/pages/private/company/jobs/PostJob";
import ManageJobs from "@/pages/private/company/jobs/ManageJobs";
import Applicants from "@/pages/private/company/applicants/Applicants";
import Shortlist from "@/pages/private/company/selection/Shortlist";
import InterviewRounds from "@/pages/private/company/selection/InterviewRounds";
import UpdateResults from "@/pages/private/company/selection/UpdateResults";

export const PrivateRoutes: RouteOptions<any>[] = [
    {
        path: "/admin/dashboard",
        component: AdminDashboard,
    },
    {
        path: "/admin/students",
        component: StudentManagement,
    },
    {
        path: "/admin/companies",
        component: CompanyManagement,
    },
    {
        path: "/admin/drives",
        component: PlacementDriveManagement,

    },
    {
        path: "/admin/report",
        component: Report,

    },
    {
        path: "/admin/notification",
        component: AdminNotificationPage,

    },
    {
        path: "/admin/setting",
        component: Setting,

    },
    {
        path: "/admin/event-management",
        component: InterviewSchedulerPage,

    },
    {
        path: "/admin/applications",
        component: ApplicationsManagement,
    },
    {
        path: "/admin/shortlisting",
        component: Shortlisting,
    },
    {
        path: "/admin/bulk-email",
        component: BulkEmail,
    },
    {
        path: "/admin/documents",
        component: DocumentManagement,
    },
    {
        path: "/admin/jobs",
        component: AdminJobManagement,
    },




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
        component: ApplicationStatus
    },
    {
        path: "/student/notifications",
        component: Notification
    },
    {
        path: "/student/documents",
        component: Documents
    },
    {
        path: "/student/interview",
        component: InterviewScheduler
    },

    // Company/Recruiter Routes
    {
        path: "/company/dashboard",
        component: CompanyDashboard
    },
    {
        path: "/company/post-job",
        component: PostJob
    },
    {
        path: "/company/jobs",
        component: ManageJobs
    },
    {
        path: "/company/applicants",
        component: Applicants
    },
    {
        path: "/company/shortlist",
        component: Shortlist
    },
    {
        path: "/company/interviews",
        component: InterviewRounds
    },
    {
        path: "/company/results",
        component: UpdateResults
    },
];