import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  BarChart3, 
  ShieldCheck, 
  Zap,
  Menu,
  X,
  ArrowRight,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
const HomePage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // UPDATED: Dark Gradient Background
<div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b3b6f] to-[#020617] selection:text-white">
      {/* Subtle Mesh Glow */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
  <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full"></div>
  <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full"></div>
</div>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-900/80 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <Zap className="text-white w-5 h-5" fill="currentColor" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase">Smart <span className="text-blue-400">CPMS</span></span>
            </div>
            
            <div className="hidden md:flex items-center gap-10">
              {['Features', 'Roles', 'About'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                  {item}
                </a>
              ))}
              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95">
                Portal Login
              </button>
            </div>

            <button className="md:hidden p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">Next-Gen Placement Hub</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-[1.1]">
            Bridging the Gap Between <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">Ambition & Opportunity</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            A ecosystem designed to automate recruitment, 
            track eligibility in real-time, and eliminate manual paperwork.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button className="group px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-600/20 hover:bg-blue-500 flex items-center gap-2 transition-all hover:gap-4">
              Get Started as Student
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm">
              Recruiter Partnership
            </button>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-4xl font-black text-white tracking-tight">Core Capabilities</h2>
            <div className="h-1.5 w-20 bg-blue-500 rounded-full mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6" />}
              title="Analytics Dashboard"
              desc="Real-time statistics on placement percentages and salary packages via interactive visual charts."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6" />}
              title="Automated Filtering"
              desc="Matching student CGPA and branch requirements instantly to ensure 100% eligibility accuracy."
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6" />}
              title="Role-Based Access"
              desc="Secure JWT-based authentication layers for Admins, Students, and Corporate HR teams."
            />
          </div>
        </div>
      </section>

      {/* Stakeholder Section */}
      <section id="roles" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 md:p-20 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight text-white">
                  Designed for Every <br/><span className="text-blue-400">Stakeholder</span>
                </h2>
                <div className="space-y-6">
                  <RoleItem 
                    icon={GraduationCap}
                    title="For Students"
                    desc="Build professional digital portfolios, receive automated alerts for eligible drives, and track applications in real-time."
                  />
                  <RoleItem 
                    icon={Briefcase}
                    title="For Recruiters"
                    desc="Post detailed JDs, access filtered talent pools instantly, and manage interview pipelines with zero manual effort."
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full group-hover:bg-blue-500/30 transition-colors"></div>
                <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl">
                  {/* Decorative UI elements */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
                      <Zap className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-2 w-24 bg-white/20 rounded-full"></div>
                      <div className="h-2 w-16 bg-white/10 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-32 w-full bg-blue-500/5 rounded-2xl border border-white/5 flex items-center justify-center">
                       <BarChart3 className="w-12 h-12 text-blue-500/40" />
                    </div>
                    <div className="h-4 w-full bg-white/5 rounded-full"></div>
                    <div className="h-4 w-2/3 bg-white/5 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-2">
              <Zap className="text-blue-500 w-6 h-6" />
              <span className="text-xl font-bold text-white tracking-tighter">Smart CPMS</span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-slate-400">
              <a href="#" className="hover:text-blue-400 transition">Privacy</a>
              <a href="#" className="hover:text-blue-400 transition">Terms</a>
              <a href="#" className="hover:text-blue-400 transition">Support</a>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-white/5">
            <p className="text-slate-500 text-sm">
              © 2026 Smart CPMS Ecosystem. Built for the future of recruitment.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Sub-components adjusted for Dark Theme
const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => {
  return (
    <div className="group p-10 rounded-[2rem] border border-white/5 bg-white/5 hover:bg-white/[0.08] hover:border-blue-500/30 transition-all duration-500">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-blue-500/10 text-blue-400 border border-blue-500/20 transition-transform group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
      <div className="mt-8 flex items-center text-blue-400 font-bold text-sm opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
        Explore <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </div>
  );
};

const RoleItem = ({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string; }) => (
  <div className="group flex gap-6 p-4 rounded-2xl hover:bg-white/5 transition-colors">
    <div className="flex-shrink-0 w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-blue-400/50 transition-colors">
      <Icon className="text-blue-400" size={28} />
    </div>
    <div>
      <h4 className="font-bold text-xl mb-1 text-white group-hover:text-blue-400 transition-colors">
        {title}
      </h4>
      <p className="text-slate-400 leading-relaxed text-sm max-w-md">
        {desc}
      </p>
    </div>
  </div>
);

export default HomePage;