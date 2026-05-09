import React, { useState, useEffect } from "react";
import { Mail, Lock, ArrowRight, Eye, EyeOff, GraduationCap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import illustration from "../../../assets/img.jpg";
import camp from "../../../assets/camp.jpg"
import campp from "../../../assets/campp.jpg";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../redux/store/store";
import type { RootState } from "../../../redux/reducers/rootReducer";
import { toast } from "sonner";
import { loginUser } from "@/redux/thunks/loginThunk";
import { ModeToggle } from "@/components/mode-toggle";

const SignIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, userType } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      const role = userType?.toLowerCase();
      if (role === "admin") navigate("/admin/dashboard", { replace: true });
      else if (role === "student") navigate("/student/dashboard", { replace: true });
      else if (role === "company") navigate("/company/dashboard", { replace: true });
      else if (role === "super_admin" || role === "superadmin") {
        navigate("/superadmin/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, userType, navigate]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Custom Validation
    if (!email) return toast.error("Please enter your email address", { id: "auth-toast" });
    if (!password) return toast.error("Please enter your password", { id: "auth-toast" });
    
    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await dispatch(
        loginUser({ email: email.toLowerCase(), password })
      ).unwrap();

      const user = result.data;
      toast.success(`Signed in as ${user.role.toLowerCase()}.`, { id: "auth-toast" });
    } catch (error: any) {
      console.error("Login error:", error);
      const message = typeof error === 'string' ? error : (error?.message || "Invalid email or password");
      toast.error(message, { id: "auth-toast" });
    } finally {
      setIsLoading(false);
    }
  };

  const images = [illustration, camp, campp];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); 
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-[#02040a] font-sans overflow-hidden">
      {/* LEFT SIDE - FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 md:px-12 py-10 md:py-12 bg-white dark:bg-[#0b0f1a]">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Brand Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br from-blue-700 to-slate-900">
                  <GraduationCap size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Smart CPMS</span>
              </div>
              <ModeToggle />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
            <p className="text-gray-500 dark:text-slate-400 mt-2">Centralized Placement Management System</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#02040a] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Link to="/Forgot" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-[#02040a] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-br from-blue-700 to-slate-900 active:scale-[0.99] transition-all duration-200 text-white font-semibold py-3 sm:py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? "Signing in..." : "Sign In to Dashboard"}
              {!isLoading && <ArrowRight size={18} />}
            </button>

            {/* Signup Link */}
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400 text-center mt-6">
              New to the platform? {" "}
              <Link to="/signup" className="text-indigo-600 dark:text-blue-400 font-bold hover:underline">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - VISUALS */}
      <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-blue-700 to-slate-900 items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full -ml-48 -mb-48 blur-3xl"></div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 sm:p-8 md:p-10 text-center text-white w-full max-w-sm md:max-w-md shadow-2xl relative z-10">
          <div className="bg-white p-4 rounded-2xl mb-8 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500 inline-block">
            <img
              src={images[currentIndex]}
              alt="Placement Stats"
              className="w-32 sm:w-40 md:w-48 h-auto rounded-lg transition-all duration-700" />
          </div>

          <h3 className="text-2xl font-bold mb-4">Accelerate Your Career</h3>
          <p className="text-indigo-100/90 leading-relaxed text-sm">
            Automating the end-to-end recruitment lifecycle. Real-time interaction between Students, Admins, and Recruiting Companies.
          </p>

          <div className="mt-8 flex gap-1.5 justify-center">
            {images.map((_, index) => (
              <span
                key={index}
                className={`h-1 rounded-full transition-all ${currentIndex === index ? "w-8 bg-white" : "w-2 bg-white/40"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
