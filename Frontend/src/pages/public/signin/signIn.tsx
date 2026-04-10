import React, { useState, useEffect } from "react";
import { Mail, Lock, ArrowRight, Eye, EyeOff, GraduationCap, Briefcase, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import illustration from "../../../assets/img.jpg";
import camp from "../../../assets/camp.jpg"
import campp from "../../../assets/campp.jpg";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../redux/store/store";
import { loginUser } from "../../../redux/thunks/loginThunk";
// Define Roles for type safety
type UserRole = "student" | "company" | "admin";

interface RoleConfig {
  id: UserRole;
  label: string;
  icon: React.ReactNode;
}

const SignIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const roles: RoleConfig[] = [
    { id: "student", label: "Student", icon: <GraduationCap size={16} /> },
    { id: "company", label: "Company", icon: <Briefcase size={16} /> },
    { id: "admin", label: "Admin", icon: <ShieldCheck size={16} /> },
  ];

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const user = await dispatch(
      loginUser({ email, password })
    ).unwrap();

    console.log("Logged user:", user);

    if (user.role === "STUDENT") {
      navigate("/student/dashboard");
    } 
    else if (user.role === "COMPANY") {
      navigate("/company-dashboard");
    } 
    else if (user.role === "ADMIN") {
      navigate("/admin/dashboard");
    }

  } catch (error) {
    console.error("Login error:", error);
  }
};
  const images = [illustration, camp, campp];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // 4 seconds is usually better for reading the text alongside the image
    return () => clearInterval(interval);
  }, [images.length]);



  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans overflow-hidden">

      {/* LEFT SIDE - FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 md:px-12 py-10 md:py-12 bg-white">        <div className="w-full max-w-sm sm:max-w-md">

        {/* Brand Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br from-blue-700 to-slate-900">
              <GraduationCap size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Smart CPMS</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Centralized Placement Management System</p>
        </div>

        {/* Role Switcher */}
        <div className="flex p-1 bg-gray-100 rounded-xl mb-8 border border-gray-200">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setActiveRole(role.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${activeRole === role.id
                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {role.icon}
              {role.label}
            </button>
          ))}
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {activeRole === 'student' ? 'University Email' : 'Professional Email'}
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 placeholder-gray-400"
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
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/20 transition-all cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Keep me signed in</span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-br from-blue-700 to-slate-900 active:scale-[0.99] transition-all duration-200 text-white font-semibold py-3 sm:py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 mt-2"
          >
            Sign In to Dashboard
            <ArrowRight size={18} />
          </button>

          {/* Signup Link */}
          <p className="text-sm font-medium text-gray-500 text-center mt-6">
            New to the platform? {" "}
            <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
      </div>

      {/* RIGHT SIDE - VISUALS */}
      <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-blue-700 to-slate-900 to-slate-900items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full -ml-48 -mb-48 blur-3xl"></div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 sm:p-8 md:p-10 text-center text-white w-full max-w-sm md:max-w-md shadow-2xl relative z-10">          <div className="bg-white p-4 rounded-2xl mb-8 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500 inline-block">
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
