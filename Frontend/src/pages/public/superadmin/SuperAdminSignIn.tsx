import React, { useEffect, useState } from "react";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Shield } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/redux/store/store";
import type { RootState } from "@/redux/reducers/rootReducer";
import { toast } from "sonner";
import { loginUser } from "@/redux/thunks/loginThunk";
import { logout } from "@/redux/slices/authSlice";

function isSuperAdminRole(role: string | undefined): boolean {
  const r = role?.toLowerCase();
  return r === "super_admin" || r === "superadmin";
}

const SuperAdminSignIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, userType } = useSelector((state: RootState) => state.auth);
  const fromPath =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ||
    "/superadmin/dashboard";

  useEffect(() => {
    if (!isAuthenticated) return;
    if (isSuperAdminRole(userType ?? undefined)) {
      navigate(fromPath, { replace: true });
    }
  }, [isAuthenticated, userType, navigate, fromPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address", { id: "superadmin-auth" });
      return;
    }
    if (!password) {
      toast.error("Please enter your password", { id: "superadmin-auth" });
      return;
    }
    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await dispatch(
        loginUser({ email: email.toLowerCase(), password })
      ).unwrap();

      const user = result.data;
      if (!isSuperAdminRole(user.role)) {
        dispatch(logout());
        toast.error("This portal is for super administrators only.", { id: "superadmin-auth" });
        setIsLoading(false);
        return;
      }

      toast.success("Signed in as super administrator.", { id: "superadmin-auth" });
      navigate(fromPath, { replace: true });
    } catch (error: unknown) {
      const message =
        typeof error === "string" ? error : (error as { message?: string })?.message || "Invalid email or password";
      toast.error(message, { id: "superadmin-auth" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 font-sans overflow-hidden">
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 md:px-12 py-10 md:py-12 bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Shield size={22} />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white">CPMS</span>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Super Admin</p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white">Administration access</h2>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Sign in with your super administrator account. Other roles must use the standard login.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400/90 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="superadmin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400/90 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-all active:scale-[0.99] ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Signing in..." : "Sign in"}
              {!isLoading && <ArrowRight size={18} />}
            </button>

            <p className="text-sm text-slate-500 text-center">
              Not a super admin?{" "}
              <Link to="/login" className="text-amber-400/90 font-semibold hover:underline">
                Standard login
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden md:flex w-full md:w-1/2 items-center justify-center p-10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-600/20 via-transparent to-transparent" />
        <div className="relative z-10 max-w-md text-center px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 mb-6">
            <Shield size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Platform oversight</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Manage universities, tenant admins, and global company records. This area is restricted to super administrator accounts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSignIn;
