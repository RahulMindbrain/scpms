import { useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  CheckCircle2,
  ArrowRight,
  Clock
} from "lucide-react";
import { AdminPageLayout } from "@/components/layout/AdminPageLayout";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/redux/store/store";
import type { RootState } from "@/redux/reducers/rootReducer";
import { fetchUniversities } from "@/redux/thunks/superadmin/universityThunks";
import { fetchAdmins } from "@/redux/thunks/superadmin/adminThunks"
const OnboardingFlow = ({ admins, companies }: any) => {
  const steps = [
    {
      id: "superadmin",
      title: "Account Activation",
      desc: "Super Admin verification",
      icon: ShieldCheck,
      count: admins.filter((a: any) => a.onboardingStep === 'ACTIVATE_ACCOUNT').length,
      status: admins.some((a: any) => a.onboardingStep === 'ACTIVATE_ACCOUNT') ? 'attention' : 'completed'
    },
    {
      id: "university",
      title: "Univ. Acceptance",
      desc: "Handle node requests",
      icon: Building2,
      count: admins.filter((a: any) => a.onboardingStep === 'UNIVERSITY_ACCEPTANCE').length,
      status: admins.some((a: any) => a.onboardingStep === 'UNIVERSITY_ACCEPTANCE') ? 'attention' : 'pending'
    },
    {
      id: "profile",
      title: "Profile Genesis",
      desc: "Institutional setup",
      icon: Users,
      count: admins.filter((a: any) => a.onboardingStep === 'CREATE_PROFILE').length,
      status: admins.some((a: any) => a.onboardingStep === 'CREATE_PROFILE') ? 'attention' : 'pending'
    },
    {
      id: "company",
      title: "Company Active",
      desc: "Final authorization",
      icon: Briefcase,
      count: companies.filter((c: any) => c.activationStep === 'PENDING_COMPANY_APPROVAL').length,
      status: companies.some((c: any) => c.activationStep === 'PENDING_COMPANY_APPROVAL') ? 'attention' : 'pending'
    }
  ];

  return (
    <div className="saas-card">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-foreground tracking-tight">Onboarding Pipeline</h3>
          <p className="text-xs font-medium text-muted-foreground mt-0.5">Real-time status of entities moving through the system</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
          Active Flow
        </div>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 hidden lg:block" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {steps.map((step, idx) => (
            <div key={step.id} className="relative group">
              <div className={`p-6 rounded-3xl border transition-all duration-300 ${step.status === 'attention'
                  ? 'bg-indigo-500/5 border-indigo-500/20 shadow-lg shadow-indigo-500/5'
                  : step.status === 'completed'
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-card border-border/50'
                }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`size-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${step.status === 'attention'
                      ? 'bg-indigo-500 text-white'
                      : step.status === 'completed'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                    <step.icon className="size-6" />
                  </div>
                  {step.count > 0 && (
                    <span className="flex size-6 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white animate-bounce">
                      {step.count}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-black text-foreground mb-1 flex items-center gap-2">
                  {step.title}
                  {step.status === 'completed' && <CheckCircle2 className="size-3 text-emerald-500" />}
                </h4>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{step.desc}</p>

                {step.status === 'attention' && (
                  <div className="mt-4 flex items-center gap-1.5 text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-500/10 w-fit px-2 py-0.5 rounded-md">
                    <Clock className="size-3" /> Action Required
                  </div>
                )}
              </div>

              {idx < steps.length - 1 && (
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-20 hidden lg:flex">
                  <div className="size-8 rounded-full bg-card border border-border/50 flex items-center justify-center text-muted-foreground shadow-sm">
                    <ArrowRight className="size-4" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SuperAdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { universities, admins, companies } = useSelector((state: RootState) => state.superAdmin);

  useEffect(() => {
    dispatch(fetchUniversities());
    dispatch(fetchAdmins());
  }, [dispatch]);

  const stats = [
    { label: "Total Universities", value: universities.length.toString(), icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Global Admins", value: admins.length.toString(), icon: ShieldCheck, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Partner Companies", value: companies?.length.toString() || "0", icon: Briefcase, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Total Students", value: "4,250", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <AdminPageLayout>
      <PageHeader
        title={`Global Command Center, ${user?.firstname || "Super Admin"}`}
        description="Unified oversight and management of the entire CPMS ecosystem."
        badge="SuperAdmin Control"
        icon={LayoutDashboard}
        variant="indigo"
      >
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Network Status</span>
            <div className="flex items-center gap-1.5 text-emerald-500 font-black text-xs uppercase">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SuperAdmin Online
            </div>
          </div>
        </div>
      </PageHeader>

      <div className="space-y-8 pb-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="saas-card group hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`size-12 rounded-2xl ${stat.bg} flex items-center justify-center transition-transform group-hover:rotate-12`}>
                  <stat.icon className={`size-6 ${stat.color}`} />
                </div>
                <div className="flex items-center gap-1 text-emerald-500 font-black text-[10px] uppercase tracking-wider">
                  <Zap className="size-3" /> +12%
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-foreground tabular-nums">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Onboarding Flow Visualization */}
        <OnboardingFlow admins={admins} universities={universities} companies={companies} />

        {/* Quick Actions & System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="saas-card h-full">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-foreground tracking-tight">System Infrastructure</h3>
                  <p className="text-xs font-medium text-muted-foreground">Monitoring node health across the distributed network</p>
                </div>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Full Audit</button>
              </div>

              <div className="space-y-6">
                {[
                  { node: "Central API Cluster", status: "Operational", load: "24%", color: "bg-emerald-500" },
                  { node: "Real-time Socket Grid", status: "High Load", load: "78%", color: "bg-amber-500" },
                  { node: "Asset Storage CDN", status: "Operational", load: "12%", color: "bg-emerald-500" },
                  { node: "Database Shards", status: "Operational", load: "45%", color: "bg-emerald-500" },
                ].map((shard, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-4">
                      <div className={`size-3 rounded-full ${shard.color} animate-pulse`} />
                      <div>
                        <p className="text-sm font-black text-foreground">{shard.node}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{shard.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Resource Load</span>
                        <div className="w-24 h-1 bg-muted rounded-full mt-1">
                          <div className={`h-full ${shard.color} rounded-full`} style={{ width: shard.load }} />
                        </div>
                      </div>
                      <span className="text-sm font-black text-foreground tabular-nums">{shard.load}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="saas-card h-full relative overflow-hidden
  bg-slate-950 text-white border border-slate-800
  dark:bg-slate-900 dark:border-slate-800">
              <div className="relative z-10">
                <h3 className="text-xl font-black text-foreground tracking-tight">SuperAdmin Broadcast</h3>
                <p className="text-sm text-slate-400 mb-8 font-medium">Issue high-level directives to all system administrators.</p>

                <div className="space-y-4">
                  <button className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between group">
                    <div className=" flex text-xl font-black text-foreground tracking-tight">
                      <div className="size-8 rounded-xl bg-indigo-500 flex items-center justify-center">
                        <ShieldCheck className="size-4" />
                      </div>
                      <span className="text-sm font-black text-muted-foreground uppercase tracking-widest">Update Security Policy</span>
                    </div>
                    <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                        <Building2 className="size-4" />
                      </div>
                      <span className="text-sm font-black text-muted-foreground uppercase tracking-widest">Onboard University</span>
                    </div>
                    <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-xl bg-amber-500 flex items-center justify-center">
                        <Zap className="size-4" />
                      </div>
                      <span className="text-sm font-black text-muted-foreground uppercase tracking-widest">System Maintenance</span>
                    </div>
                    <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
              {/* Background gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full -mr-32 -mt-32" />
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default SuperAdminDashboard;
