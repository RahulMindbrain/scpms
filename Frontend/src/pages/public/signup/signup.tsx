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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../redux/store/store";
import { registerUser } from "../../../redux/thunks/registerThunk";
import { useNavigate } from "react-router-dom";

type RegisterRole = "student" | "company";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [step, setStep] = useState(1);
  const [activeRole, setActiveRole] = useState<RegisterRole | null>(null);
  const [agreed, setAgreed] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
    course: "",
    graduationYear: "",
    companyName: "",
    designation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role: RegisterRole) => {
    setActiveRole(role);
    // Add a slight delay for better UX feel before transitioning
    setTimeout(() => setStep(2), 200);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!agreed) {
    alert("Please agree to Terms");
    return;
  }

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const names = form.fullName.trim().split(" ");
  const firstname = names[0];
  const lastname = names.length > 1 ? names.slice(1).join(" ") : "NA";

  const payload = {
    firstname,
    lastname,
    email: form.email,
    password: form.password,
    role: activeRole === "student" ? "STUDENT" : "COMPANY",
  };

  try {
    await dispatch(registerUser(payload)).unwrap();

    alert("Registration successful");

    // ✅ redirect to login
    navigate("/login");

  } catch (err: any) {
    alert(err);
  }
};
  // Reusable input style
  const inputClasses = "w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all duration-200 outline-none text-slate-700 placeholder:text-slate-400";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans">
      {/* LEFT SIDE BRANDING */}
      <div className="hidden md:flex w-full md:w-[40%] bg-gradient-to-br from-blue-700 to-slate-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full -ml-48 -mb-48 blur-3xl"></div>

        <div className="relative z-10 text-white max-w-sm">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-8 border border-white/30 shadow-xl">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-4xl font-extrabold mb-6 tracking-tight leading-tight">
            Architect Your <br /> Professional Path
          </h1>
          <p className="text-indigo-100 leading-relaxed mb-8 font-medium">
            Join the Smart CPMS ecosystem to connect with elite COMPANYs and automate your career trajectory.
          </p>
          <ul className="space-y-4">
            {["Algorithmic Profile Matching", "Real-time Interview Tracking", "Institutional Grade Security"].map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-semibold text-indigo-50">
                <div className="bg-indigo-500 rounded-full p-1"><Check size={12} /></div> {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-[60%] flex items-center justify-center px-6 py-12 md:px-12 bg-white">
        <div className="w-full max-w-lg">
       
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10 text-center md:text-left">
                <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Get Started</h2>
                <p className="text-slate-500 text-lg">Select your account type to continue</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
                <button
                  onClick={() => handleRoleSelect("student")}
                  className={`group relative flex flex-col items-center text-center p-8 rounded-[2rem] border-2 transition-all duration-300 shadow-sm
                    ${activeRole === "student" ? "border-indigo-600 bg-indigo-50/30 ring-4 ring-indigo-600/5" : "border-slate-100 hover:border-indigo-200 hover:shadow-md bg-white"}`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300
                    ${activeRole === "student" ? "bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-200" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"}`}>
                    <GraduationCap size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Student</h3>
                  <p className="text-sm text-slate-500 mt-2">I want to discover opportunities and grow my career.</p>
                </button>

                <button
                  onClick={() => handleRoleSelect("company")}
                  className={`group relative flex flex-col items-center text-center p-8 rounded-[2rem] border-2 transition-all duration-300 shadow-sm
                    ${activeRole === "company" ? "border-indigo-600 bg-indigo-50/30 ring-4 ring-indigo-600/5" : "border-slate-100 hover:border-indigo-200 hover:shadow-md bg-white"}`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300
                    ${activeRole === "company" ? "bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-200" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"}`}>
                    <Briefcase size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">COMPANY</h3>
                  <p className="text-sm text-slate-500 mt-2">I am looking to hire the best talent for my organization.</p>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500" onSubmit={handleSubmit}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 mb-6 transition-colors"
              >
                <ChevronLeft size={18} /> Back to Role Selection
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  {activeRole === "student" ? "Student Registration" : "COMPANY Registration"}
                </h2>
                <p className="text-slate-500 mt-1">Complete the details below to initialize your profile.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* NAME */}
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input name="fullName" onChange={handleChange} required placeholder="Full Name" className={inputClasses} />
                </div>

                {/* EMAIL */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input name="email" type="email" onChange={handleChange} required placeholder={activeRole === "student" ? "Institution Email" : "Work Email"} className={inputClasses} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input name="password" type="password" onChange={handleChange} required placeholder="Password" className={inputClasses} />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input name="confirmPassword" type="password" onChange={handleChange} required placeholder="Confirm" className={inputClasses} />
                  </div>
                </div>

                {activeRole === "student" ? (
                  <>
                    <input name="university" onChange={handleChange} required placeholder="University Name" className={inputClasses.replace("pl-12", "pl-6")} />
                    <div className="grid grid-cols-2 gap-4">
                        <input name="course" onChange={handleChange} required placeholder="Course" className={inputClasses.replace("pl-12", "pl-6")} />
                        <input name="graduationYear" onChange={handleChange} required placeholder="Grad Year" className={inputClasses.replace("pl-12", "pl-6")} />
                    </div>
                  </>
                ) : (
                  <>
                    <input name="companyName" onChange={handleChange} required placeholder="Company Name" className={inputClasses.replace("pl-12", "pl-6")} />
                    <input name="designation" onChange={handleChange} required placeholder="Designation" className={inputClasses.replace("pl-12", "pl-6")} />
                  </>
                )}
              </div>

              <div
                className="flex items-center gap-3 cursor-pointer group select-none"
                onClick={() => setAgreed(!agreed)}
              >
                <div className={`w-6 h-6 border rounded-lg flex items-center justify-center transition-all 
                  ${agreed ? "bg-indigo-600 border-indigo-600" : "border-slate-300 group-hover:border-indigo-400"}`}>
                  {agreed && <Check size={14} className="text-white" />}
                </div>
                <p className="text-sm text-slate-500">I agree to the <span className="text-indigo-600 font-bold underline cursor-pointer">Terms and Privacy Policy</span></p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-br from-indigo-700 to-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-[0.98]"
              >
                Initialize Profile
                <ArrowRight size={20} />
              </button>
              
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
