import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ChevronLeft, ArrowRight, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import forgot from '../../../assets/forgot.png';

const ResetPassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans selection:bg-blue-100">
        <div className="w-full max-w-[500px] bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-600" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-4">Password Reset!</h1>
          <p className="text-slate-500 mb-8">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <Link 
            to="/login" 
            className="w-full bg-gradient-to-r from-[#1E40AF] to-[#1A365D] hover:from-[#1A365D] hover:to-[#1E3A8A] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans selection:bg-blue-100">
      
      {/* Main Container */}
      <div className="w-full max-w-[1000px] bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side: Form */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#1A3785] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <GraduationCap className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-[#0F172A] tracking-tight">Smart CPMS</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Create New Password</h1>
            <p className="text-slate-500 text-sm">
              Your new password must be different from previous used passwords.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* New Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                New Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={20} strokeWidth={2} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl py-4 pl-12 pr-12 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={20} strokeWidth={2} />
                </div>
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl py-4 pl-12 pr-12 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50/50 rounded-xl p-4 space-y-2">
              <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">Password Requirements:</p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                  Minimum 8 characters long
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                  Must contain at least one special character
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full bg-gradient-to-r from-[#1E40AF] to-[#1A365D] hover:from-[#1A365D] hover:to-[#1E3A8A] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98]">
              <span>Reset Password</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>

            {/* Back to Login */}
            <div className="flex justify-center pt-2">
              <Link to="/login" className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors group">
                <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                Back to Login
              </Link>
            </div>
          </form>

          <p className="mt-10 text-center text-slate-400 text-xs">
            © 2026 Centralized Placement Management System
          </p>
        </div>

        {/* Right Side: Decorative/Info */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-blue-600 to-indigo-900 p-12 items-center justify-center relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
          
          {/* Animated subtle shapes */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-white/10 rounded-full animate-pulse delay-700"></div>

          <div className="relative z-10 text-center max-w-sm">
            {/* The Image Container */}
            <div className="bg-white p-3 rounded-2xl shadow-2xl -rotate-2 mb-10 transform transition-transform hover:rotate-0 duration-500">
               <div className="aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src={forgot} 
                  alt="Reset Password Illustration" 
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                />
               </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">Secure Password</h2>
            <p className="text-blue-100/80 leading-relaxed text-sm">
              Use a combination of letters, numbers, and symbols to create a strong password that's hard to guess.
            </p>
            
            {/* Pagination dots matching forgot page but slightly changed to indicate "next step" feel */}
            <div className="flex justify-center gap-2 mt-8">
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                <div className="w-8 h-1.5 bg-white rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
