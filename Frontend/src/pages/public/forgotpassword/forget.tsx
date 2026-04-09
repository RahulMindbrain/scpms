import React from 'react';
import { Mail, ChevronLeft, ArrowRight, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import forgot from '../../../assets/forgot.png'
const ForgotPassword: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans selection:bg-blue-100">
      
      {/* Main Container mirroring the image's split feel */}
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
            <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Reset Password</h1>
            <p className="text-slate-500 text-sm">
              Enter your registered email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                University Email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail size={20} strokeWidth={2} />
                </div>
                <input 
                  type="email" 
                  placeholder="name@university.edu"
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* Submit Button - Matching the Blue Gradient in Image */}
            <button className="w-full bg-gradient-to-r from-[#1E40AF] to-[#1A365D] hover:from-[#1A365D] hover:to-[#1E3A8A] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98]">
              <span>Send Reset Link</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>

            {/* Back to Login */}
            <div className="flex justify-center pt-4">
              <Link to="/login" className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors group">
                <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                Back to Login
              </Link>
            </div>
          </form>

          <p className="mt-12 text-center text-slate-400 text-xs">
            © 2026 Centralized Placement Management System
          </p>
        </div>

        {/* Right Side: Decorative/Info (Matching the blue card in image) */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-blue-600 to-indigo-900 p-12 items-center justify-center relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center max-w-sm">
            {/* The "Polaroid" style image container from your UI */}
            <div className="bg-white p-3 rounded-2xl shadow-2xl rotate-3 mb-10 transform transition-transform hover:rotate-0 duration-500">
               <div className="aspect-[4/3] bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                <img 
  src={forgot} 
  alt="Forgot Password Illustration" 
  className="w-full h-full object-cover"
/>
               </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">Secure Access</h2>
            <p className="text-blue-100/80 leading-relaxed">
              We use multi-layered security to ensure your placement data and career profile stay protected at all times.
            </p>
            
            {/* Pagination dots from image */}
            <div className="flex justify-center gap-2 mt-8">
                <div className="w-8 h-1.5 bg-white rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
