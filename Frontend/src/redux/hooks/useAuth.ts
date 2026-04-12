import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { AdminUser, StudentUser, CompanyUser } from "../slices/authSlice";

/**
 * Central auth hook — access user details anywhere in the app.
 *
 * API stores: { id, firstname, lastname, email, role, status }
 *
 * Usage:
 *   const { user, isAuthenticated, userType, firstName, initials } = useAuth();
 *   const { adminData } = useAuth();    // only populated when role === "ADMIN"
 *   const { studentData } = useAuth();  // only populated when role === "STUDENT"
 *   const { companyData } = useAuth();  // only populated when role === "COMPANY"
 */
const useAuth = () => {
    const auth = useSelector((state: RootState) => state.auth);

    const user = auth.user;

    /** "Abhinash" */
    const firstName = user?.firstname ?? "User";

    /** "Abhinash Nayak" */
    const fullName = user ? `${user.firstname} ${user.lastname}` : "User";

    /**
     * Up to 2 initials from first + last name.
     * "Abhinash Nayak" → "AN"
     */
    const initials = user
        ? `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase()
        : "?";

    return {
        // ── Core auth state ──────────────────────────────────────────────────
        user,
        token: auth.token,
        isAuthenticated: auth.isAuthenticated,
        userType: auth.userType,      // "ADMIN" | "STUDENT" | "COMPANY" | null
        loading: auth.loading,
        error: auth.error,

        // ── Convenience derived values ───────────────────────────────────────
        firstName,
        fullName,
        initials,

        // ── Role-specific typed data ─────────────────────────────────────────
        adminData: auth.adminData as AdminUser | null,
        studentData: auth.studentData as StudentUser | null,
        companyData: auth.companyData as CompanyUser | null,

        // ── Role helpers ─────────────────────────────────────────────────────
        isAdmin: auth.userType === "ADMIN",
        isStudent: auth.userType === "STUDENT",
        isCompany: auth.userType === "COMPANY",
    };
};

export default useAuth;
