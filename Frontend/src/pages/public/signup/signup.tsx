import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Check,
  ChevronLeft,
  EyeOff,
  Eye,
  FileText, // Added for description
  Building2, // Added for company name
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../redux/store/store";
import type { RootState } from "../../../redux/reducers/rootReducer";
import { registerUser } from "../../../redux/thunks/registerThunk";
import { toast } from "sonner";

type RegisterRole = "STUDENT" | "COMPANY";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [step, setStep] = useState(1);
  const [activeRole, setActiveRole] = useState<RegisterRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { isAuthenticated, userType } = useSelector((state: RootState) => state.auth);

  // New state fields added to form
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    description: "",
  });

  React.useEffect(() => {
    if (isAuthenticated) {
      const role = userType?.toLowerCase();
      if (role === "admin") navigate("/admin/dashboard", { replace: true });
      else if (role === "student") navigate("/student/dashboard", { replace: true });
      else if (role === "company") navigate("/company/dashboard", { replace: true });
    }
  }, [isAuthenticated, userType, navigate]);

  React.useEffect(() => {
    if (step === 2) {
      window.history.pushState({ step: 2 }, "");
      const handlePopState = (_e: PopStateEvent) => setStep(1);
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "fullName" && value !== "" && !/^[a-zA-Z\s]*$/.test(value)) {
      toast.error("Names can only contain letters and spaces", { id: "name-validation", duration: 2000 });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleRoleSelect = (role: RegisterRole) => {
    setActiveRole(role);
    setTimeout(() => setStep(2), 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    // Basic Validations
    if (!form.fullName.trim()) return toast.error("Full name is required", { id: "register-toast" });
    if (!form.email.trim()) return toast.error("Email address is required", { id: "register-toast" });
    if (form.password !== form.confirmPassword) return toast.error("Passwords do not match", { id: "register-toast" });
    if (!passwordRegex.test(form.password)) {
      return toast.error("Password must contain at least one uppercase and one lowercase letter", { id: "register-toast" });
    }

    // Company Specific Validations
    if (activeRole === "COMPANY") {
      if (!form.companyName.trim()) return toast.error("Company name is required", { id: "register-toast" });
      if (!form.description.trim()) return toast.error("Company description is required", { id: "register-toast" });
    }

    const names = form.fullName.trim().split(/\s+/);
    if (names.length < 2) return toast.error("Please enter your full name (First and Last name)", { id: "register-toast" });

    const firstname = names[0];
    const lastname = names.slice(1).join(" ");

    // Inside handleSubmit...

    const payload = {
      firstname,
      lastname,
      email: form.email.toLowerCase(),
      password: form.password,
      role: activeRole,
      // Wrap name and description inside a 'company' object
      ...(activeRole === "COMPANY" && {
        company: {
          name: form.companyName,
          description: form.description,
        },
      }),
    };

    setIsSubmitting(true);
    try {
      await dispatch(registerUser(payload)).unwrap();
      toast.success("Registration successful! Please sign in to continue.", { id: "register-toast" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      const message = typeof err === "string" ? err : err?.message || "Registration failed.";
      toast.error(message, { id: "register-toast" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all duration-200 outline-none text-slate-700 placeholder:text-slate-400";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans">
      {/* LEFT SIDE BRANDING (Same as yours) */}
      <div className="hidden md:flex w-full md:w-[40%] bg-gradient-to-br from-blue-700 to-slate-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10 text-white max-w-sm">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-8 border border-white/30 shadow-xl">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-4xl font-extrabold mb-6 tracking-tight">Architect Your <br /> Professional Path</h1>
          <p className="text-indigo-100 mb-8 font-medium">Join the Smart CPMS ecosystem to connect with elite Companies.</p>
          <ul className="space-y-4">
            {["Algorithmic Profile Matching", "Real-time Tracking", "Institutional Security"].map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-semibold text-indigo-50">
                <div className="bg-indigo-500 rounded-full p-1"><Check size={12} /></div> {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-[60%] flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-lg">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center md:text-left">
              <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Get Started</h2>
              <p className="text-slate-500 text-lg mb-10">Select your account type to continue</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button onClick={() => handleRoleSelect("STUDENT")} className={`group p-8 rounded-[2rem] border-2 transition-all ${activeRole === "STUDENT" ? "border-indigo-600 bg-indigo-50/30" : "border-slate-100 hover:border-indigo-200"}`}>
                  <GraduationCap size={32} className="mx-auto mb-4 text-slate-400 group-hover:text-indigo-600" />
                  <h3 className="font-bold">Student</h3>
                </button>
                <button onClick={() => handleRoleSelect("COMPANY")} className={`group p-8 rounded-[2rem] border-2 transition-all ${activeRole === "COMPANY" ? "border-indigo-600 bg-indigo-50/30" : "border-slate-100 hover:border-indigo-200"}`}>
                  <Briefcase size={28} className="mx-auto mb-4 text-slate-400 group-hover:text-indigo-600" />
                  <h3 className="font-bold">Company</h3>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500" onSubmit={handleSubmit}>
              <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-sm font-semibold text-indigo-600 mb-4">
                <ChevronLeft size={18} /> Back
              </button>

              <h2 className="text-3xl font-black text-slate-900">{activeRole === "STUDENT" ? "Student" : "Company"} Registration</h2>

              <div className="grid grid-cols-1 gap-4">
                {/* COMPANY SPECIFIC FIELDS */}
                {activeRole === "COMPANY" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Company Name</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input name="companyName" value={form.companyName} onChange={handleChange} required placeholder="Microsoft" className={inputClasses} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Company Description</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-5 text-slate-400" size={20} />
                        <textarea name="description" value={form.description} onChange={handleChange} required placeholder="Brief about your company..." className={`${inputClasses} pl-12 min-h-[100px] py-4`} />
                      </div>
                    </div>
                  </>
                )}

                {/* SHARED FIELDS */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Contact Person Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Enter full name" className={inputClasses} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="name@example.com" className={inputClasses} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 relative">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                    <Lock className="absolute left-4 top-[46px] -translate-y-1/2 text-slate-400" size={20} />
                    <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} required placeholder="••••••••" className={inputClasses} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[46px] -translate-y-1/2 text-slate-400">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="space-y-1 relative">
                    <label className="text-sm font-semibold text-slate-700 ml-1">
                      Confirm password
                    </label>

                    <Lock
                      className="absolute left-4 top-[46px] -translate-y-1/2 text-slate-400"
                      size={20}
                    />

                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder=""
                      className={inputClasses}
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-[46px] -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className={`w-full bg-indigo-700 text-white font-bold py-4 rounded-2xl mt-4 ${isSubmitting ? 'opacity-70' : ''}`}>
                {isSubmitting ? "Processing..." : "Initialize Profile"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;