import { useEffect } from "react";
import { LayoutDashboard, Users, Building2, Briefcase, ShieldCheck, Zap, ArrowUpRight } from "lucide-react";
import { AdminPageLayout } from "@/components/layout/AdminPageLayout";
import { PageHeader } from "@/components/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/redux/store/store";
import type { RootState } from "@/redux/reducers/rootReducer";
import { fetchUniversities, fetchAdmins, fetchProfessions } from "@/redux/thunks/superAdminThunk";

const SuperAdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { universities, admins, professions } = useSelector((state: RootState) => state.superAdmin);

  useEffect(() => {
    dispatch(fetchUniversities());
    dispatch(fetchAdmins());
    dispatch(fetchProfessions());
  }, [dispatch]);

  const stats = [
    { label: "Total Universities", value: universities.length.toString(), icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Global Admins", value: admins.length.toString(), icon: ShieldCheck, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Total Students", value: "4,250", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Professions", value: professions.length.toString(), icon: Briefcase, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <AdminPageLayout>
      <PageHeader
        title={`Global Command Center, ${user?.firstname || "Super Admin"}`}
        description="Unified oversight and management of the entire CPMS ecosystem."
        badge="Nexus Control"
        icon={LayoutDashboard}
        variant="indigo"
      >
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Network Status</span>
            <div className="flex items-center gap-1.5 text-emerald-500 font-black text-xs uppercase">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Nexus Online
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
            <div className="saas-card h-full bg-slate-900 text-white border-none relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-black tracking-tight mb-2">Nexus Broadcast</h3>
                <p className="text-sm text-slate-400 mb-8 font-medium">Issue high-level directives to all system administrators.</p>
                
                <div className="space-y-4">
                   <button className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <div className="size-8 rounded-xl bg-indigo-500 flex items-center justify-center">
                            <ShieldCheck className="size-4" />
                         </div>
                         <span className="text-sm font-bold">Update Security Policy</span>
                      </div>
                      <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                   </button>
                   <button className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <div className="size-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                            <Building2 className="size-4" />
                         </div>
                         <span className="text-sm font-bold">Onboard University</span>
                      </div>
                      <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                   </button>
                   <button className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <div className="size-8 rounded-xl bg-amber-500 flex items-center justify-center">
                            <Zap className="size-4" />
                         </div>
                         <span className="text-sm font-bold">System Maintenance</span>
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
