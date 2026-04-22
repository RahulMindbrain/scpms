import React, { useState } from 'react';
import { Mail, ChevronLeft, ArrowRight, GraduationCap, Lock, ShieldCheck, KeyRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import forgot from '../../../assets/forgot.png';
import { useDispatch } from 'react-redux';
import { forgotPassword, verifyOTP, resetPassword } from '../../../redux/thunks/forgotPasswordThunk';
import { toast } from 'sonner';
import type { AppDispatch } from '@/redux/store/store';

type FlowStep = 'EMAIL' | 'OTP' | 'RESET';

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [step, setStep] = useState<FlowStep>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setIsLoading(true);
    try {
      await dispatch(forgotPassword(email)).unwrap();
      toast.success("OTP sent successfully to your email");
      setStep('OTP');
    } catch (error: any) {
      toast.error(error || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");

    setIsLoading(true);
    try {
      await dispatch(verifyOTP({ email, otp })).unwrap();
      toast.success("OTP verified successfully");
      setStep('RESET');
    } catch (error: any) {
      toast.error(error || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    setIsLoading(true);
    try {
      await dispatch(resetPassword({ email, newpassword: newPassword })).unwrap();
      toast.success("Password reset successful. Please login with your new password.");
      navigate('/login');
    } catch (error: any) {
      toast.error(error || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 'EMAIL':
        return (
          <form className="space-y-6" onSubmit={handleSendOTP}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">University Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail size={20} strokeWidth={2} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  required
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#1E40AF] to-[#1A365D] hover:from-[#1A365D] hover:to-[#1E3A8A] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? "Sending OTP..." : "Send OTP"}</span>
              {!isLoading && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
            </button>
          </form>
        );
      case 'OTP':
        return (
          <form className="space-y-6" onSubmit={handleVerifyOTP}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Verification Code</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <ShieldCheck size={20} strokeWidth={2} />
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400 text-slate-900 font-medium tracking-[0.5em]"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? "Verifying..." : "Verify OTP"}</span>
              {!isLoading && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
            </button>
            <button
              type="button"
              onClick={() => setStep('EMAIL')}
              className="w-full text-slate-500 text-sm font-medium hover:text-slate-700 transition-colors"
            >
              Resend OTP or Change Email
            </button>
          </form>
        );
      case 'RESET':
        return (
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">New Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={20} strokeWidth={2} />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Confirm New Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <KeyRound size={20} strokeWidth={2} />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#1E40AF] to-[#1A365D] hover:from-[#1A365D] hover:to-[#1E3A8A] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? "Resetting..." : "Reset Password"}</span>
              {!isLoading && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
            </button>
          </form>
        );
    }
  };

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
            <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
              {step === 'EMAIL' ? 'Reset Password' : step === 'OTP' ? 'Verify OTP' : 'Set New Password'}
            </h1>
            <p className="text-slate-500 text-sm">
              {step === 'EMAIL'
                ? "Enter your registered email address and we'll send you an OTP to reset your password."
                : step === 'OTP'
                  ? `Enter the 6-digit verification code sent to ${email}`
                  : "Create a strong new password for your account."}
            </p>
          </div>

          {renderCurrentStep()}

          {/* Back to Login */}
          <div className="flex justify-center pt-8">
            <Link to="/login" className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors group">
              <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              Back to Login
            </Link>
          </div>

          <p className="mt-12 text-center text-slate-400 text-xs">
            © 2026 Centralized Placement Management System
          </p>
        </div>

        {/* Right Side: Decorative/Info */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-blue-600 to-indigo-900 p-12 items-center justify-center relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center max-w-sm">
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

            <div className="flex justify-center gap-2 mt-8">
              <div className={`h-1.5 transition-all duration-300 rounded-full ${step === 'EMAIL' ? 'w-8 bg-white' : 'w-1.5 bg-white/40'}`}></div>
              <div className={`h-1.5 transition-all duration-300 rounded-full ${step === 'OTP' ? 'w-8 bg-white' : 'w-1.5 bg-white/40'}`}></div>
              <div className={`h-1.5 transition-all duration-300 rounded-full ${step === 'RESET' ? 'w-8 bg-white' : 'w-1.5 bg-white/40'}`}></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
