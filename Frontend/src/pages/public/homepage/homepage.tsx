import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  BarChart3,
  ShieldCheck,
  Zap,
  Menu,
  X,
  ArrowRight,
  ChevronRight,
  Calendar,
  FileText,
  Mail,
  CheckCircle2,
  Building2
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-500/30">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-5'
        }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 shadow-lg shadow-blue-500/20">
                <GraduationCap className="text-white" size={24} />
              </div>
              <span className={`text-xl font-extrabold tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                Smart CPMS
              </span>
            </div>

            <div className="hidden md:flex items-center gap-10">
              <div className="flex items-center gap-8">
                {['Features', 'Portals', 'Stats'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`}
                    className={`text-sm font-semibold transition-colors ${scrolled ? 'text-slate-500 hover:text-blue-600' : 'text-slate-300 hover:text-white'}`}>
                    {item}
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-6 ml-4 border-l border-slate-200/20 pl-6">
                <a href="/login" className={`text-sm font-bold ${scrolled ? 'text-slate-900' : 'text-white'} hover:text-blue-500 transition-colors`}>
                  Sign In
                </a>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                >
                  Get Started <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <button className= {`md:hidden p-2 ${scrolled || isMenuOpen ? 'text-slate-900' : 'text-white'}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden fixed inset-0 z-40 bg-white transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
          }`}>
          <div className="flex flex-col h-full pt-24 px-8 pb-10">
            <div className="flex flex-col gap-6 mb-auto">
              {['Features', 'Portals', 'Stats'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-bold text-slate-800 hover:text-blue-600 transition-colors">
                  {item}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <a href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center py-4 text-lg font-bold text-slate-900 border border-slate-200 rounded-2xl">
                Sign In
              </a>
              <button className="py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/20">
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-[90vh] flex items-center pt-28 pb-20 md:pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.png"
            alt="Campus Architecture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 mb-8">
              <Zap size={14} className="text-teal-400" />
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Next-Gen Placement Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1]">
              Placements, <span className="text-teal-400">Simplified</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
              A unified digital hub for TPOs, students, and recruiters.
              Automate drives, track applications, and boost placement rates
              — all from one platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <button className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all hover:translate-y-[-2px]">
                Launch Dashboard <ChevronRight size={18} />
              </button>
              <button className="px-8 py-3.5 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all">
                Explore Features
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section Overlay */}
      <section id="stats" className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 -mt-12 md:-mt-20">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-500/5 border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <StatItem value="570+" label="Registered Students" />
            <StatItem value="42" label="Partner Companies" border="md:border-l" />
            <StatItem value="340+" label="Students Placed" border="lg:border-l border-t md:border-t-0" />
            <StatItem value="₹8.2L" label="Avg Package" border="md:border-l border-t md:border-t-0 lg:border-t-0" />
          </div>
        </div>
      </section>

      {/* "Everything You Need" Feature Grid */}
      <section id="features" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Everything You Need</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              A complete suite of tools to digitize and automate your campus placement process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={BarChart3}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
              title="Real-Time Analytics"
              desc="Track placement stats, department performance, and salary trends with interactive dashboards."
            />
            <FeatureCard
              icon={ShieldCheck}
              iconBg="bg-indigo-50"
              iconColor="text-indigo-600"
              title="Role-Based Access"
              desc="Secure JWT-based authentication with separate portals for TPOs, students, and companies."
            />
            <FeatureCard
              icon={Zap}
              iconBg="bg-cyan-50"
              iconColor="text-cyan-500"
              title="Auto Eligibility"
              desc="Automatically filter students by CGPA, branch, and backlogs — only eligible candidates can apply."
            />
            <FeatureCard
              icon={Calendar}
              iconBg="bg-blue-50"
              iconColor="text-blue-700"
              title="Interview Scheduling"
              desc="Centralized calendar for placement drives, preventing scheduling conflicts across companies."
            />
            <FeatureCard
              icon={FileText}
              iconBg="bg-violet-50"
              iconColor="text-violet-600"
              title="Digital Portfolios"
              desc="Standardized student profiles and automated resume validation for easier evaluation."
            />
            <FeatureCard
              icon={Mail}
              iconBg="bg-teal-50"
              iconColor="text-teal-600"
              title="Automated Alerts"
              desc="Instant email and push notifications for drive updates, shortlisting, and final offers."
            />
          </div>
        </div>
      </section>

      {/* "Built for Everyone" Portals Section */}
      <section id="portals" className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Built for Everyone</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Dedicated portals tailored for each stakeholder in the placement ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PortalCard
              icon={Users}
              iconColor="bg-blue-600"
              title="TPO / Admin"
              desc="Manage drives, approve profiles, monitor analytics, and orchestrate the entire placement lifecycle."
              buttonText="Access TPO Portal"
              navigateTo="/login"
            />
            <PortalCard
              icon={GraduationCap}
              iconColor="bg-gradient-to-br from-teal-500 to-emerald-500"
              title="Students"
              desc="Build your portfolio, track eligibility, apply to drives, and follow your application status in real time."
              buttonText="Student Portal"
               navigateTo="/login"
            />
            <PortalCard
              icon={Building2}
              iconColor="bg-indigo-700"
              title="Companies"
              desc="Post job descriptions, filter candidates by criteria, schedule interviews, and update selection results."
              buttonText="Company Portal"
               navigateTo="/login"
            />
          </div>
        </div>
      </section>

      {/* "Why Go Digital?" Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-slate-900 mb-8 leading-tight">Why Go Digital?</h2>
              <ul className="space-y-6">
                <CheckListItem text="Zero paperwork — from registration to offer letters" />
                <CheckListItem text="Centralized data prevents duplicate entries & fake records" />
                <CheckListItem text="Full transparency — students know their status at every stage" />
                <CheckListItem text="Mobile-first design for on-the-go access" />
                <CheckListItem text="Automated eligibility filtering saves hours of manual work" />
              </ul>
            </div>

            <div className="flex-1 w-full">
              <div className="bg-[#1e293b] rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl">
                <div className="space-y-12">
                  <div>
                    <div className="text-5xl md:text-6xl font-black mb-2 tracking-tight">59.6%</div>
                    <div className="text-slate-400 font-medium">Overall Placement Rate</div>
                  </div>
                  <div className="h-px bg-slate-700/50 w-full"></div>
                  <div>
                    <div className="text-4xl md:text-5xl font-black text-teal-400 mb-2 tracking-tight">₹24 LPA</div>
                    <div className="text-slate-400 font-medium">Highest Package This Season</div>
                  </div>
                  <div className="h-px bg-slate-700/50 w-full"></div>
                  <div>
                    <div className="text-4xl md:text-5xl font-black mb-2 tracking-tight">42</div>
                    <div className="text-slate-400 font-medium">Companies Onboarded</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0f172a] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-500 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your Placements?
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Join the smart campus revolution. Get started in minutes — no setup complexity.
          </p>
          <Link
            to="/signup"
            className="bg-teal-500 hover:bg-teal-400 text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-2 mx-auto transition-all hover:scale-105 active:scale-95 shadow-xl shadow-teal-500/20"
          >
            Get Started Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-blue-600 p-1 rounded-md">
              <GraduationCap className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Smart CPMS</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 Smart Campus Placement Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Sub-components
const StatItem = ({ value, label, border }: { value: string, label: string, border?: string }) => (
  <div className={`p-10 text-center flex flex-col justify-center items-center h-full min-h-[160px] border-slate-100 ${border || ''}`}>
    <div className="text-4xl font-black text-[#0369a1] mb-2 tracking-tight">{value}</div>
    <div className="text-slate-500 font-medium text-sm">{label}</div>
  </div>
);

const FeatureCard = ({ icon: Icon, iconBg, iconColor, title, desc }: {
  icon: LucideIcon,
  iconBg: string,
  iconColor: string,
  title: string,
  desc: string
}) => (
  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group">
    <div className={`w-12 h-12 ${iconBg} ${iconColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-4">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm">
      {desc}
    </p>
  </div>
);

const CheckListItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-4">
    <div className="mt-1 flex-shrink-0">
      <CheckCircle2 className="text-green-500 w-5 h-5" />
    </div>
    <span className="text-slate-600 font-medium">{text}</span>
  </li>
);

const PortalCard = ({ icon: Icon, iconColor, title, desc, buttonText }: {
  icon: LucideIcon,
  iconColor: string,
  title: string,
  desc: string,
  buttonText: string
  navigateTo: string
}) => (
  <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center">
    <div className={`w-16 h-16 ${iconColor} rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-black/5`}>
      <Icon size={32} className="text-white" />
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
    <p className="text-slate-500 leading-relaxed mb-8 text-sm">
      {desc}
    </p>
    <button className="mt-auto px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 group">
      {buttonText} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

export default HomePage;