import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  ChevronRight,
  Send,
  Sparkles,
  GraduationCap,
  Briefcase,
  Info,
  Target,
  BookOpen,
  AlertCircle,
  AlignLeft,
  IndianRupee,
  Plus,
  RefreshCw,
  ExternalLink,
  History,
  CheckCircle2,
  XCircle,
  Timer,
  MapPin
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import type { RootState } from "@/redux/reducers/rootReducer";
import type { AppDispatch } from "@/redux/store/store";
import { fetchCompanyJobs } from "@/redux/thunks/companyThunk";
import { sendJobToUniversity } from "@/redux/thunks/superadmin/companyUniversityThunk";
import { getAPI, putAPI } from "@/apis/api";
import Loader from "@/components/Loader";

const SendJobUniversityRequest = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const queryJobId = searchParams.get("jobId");

  const companyJobs = useSelector((state: RootState) => state.company.jobs) || [];
  const loading = useSelector((state: RootState) => state.companyUniversity.loading);

  const [universities, setUniversities] = useState<any[]>([]);
  const [isUniversityLoading, setIsUniversityLoading] = useState(false);

  const [formData, setFormData] = useState({
    jobId: queryJobId || "",
    universityId: "",
    salary: "",
    minCgpa: "",
    maxBacklogs: "0",
    openings: "",
    description: "",
  });
  const [jobRequests, setJobRequests] = useState<any[]>([]);
  const [isRequestsLoading, setIsRequestsLoading] = useState(false);
  const [isReapplying, setIsReapplying] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchCompanyJobs({ page: 1, limit: 200 }));
  }, [dispatch]);

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        setIsUniversityLoading(true);
        const response = await getAPI<any>("/university", { page: 1, limit: 200 });
        const rows = response?.data?.data || [];
        setUniversities(Array.isArray(rows) ? rows : []);
      } catch (error: any) {
        toast.error(error?.message || "Failed to load universities");
        setUniversities([]);
      } finally {
        setIsUniversityLoading(false);
      }
    };

    loadUniversities();
  }, []);

  const loadJobRequests = async () => {
    try {
      setIsRequestsLoading(true);
      const response = await getAPI<any>("/job-universities", { page: 1, limit: 100 });
      const rows = response?.data?.data || [];
      setJobRequests(Array.isArray(rows) ? rows : []);
    } catch (error: any) {
      console.error("Failed to load job requests:", error);
    } finally {
      setIsRequestsLoading(false);
    }
  };

  useEffect(() => {
    loadJobRequests();
  }, []);

  useEffect(() => {
    if (queryJobId) {
      setFormData((prev) => ({ ...prev, jobId: queryJobId }));
    }
  }, [queryJobId]);

  const selectedJob = useMemo(
    () => companyJobs.find((job: any) => String(job.id) === String(formData.jobId)),
    [companyJobs, formData.jobId],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.jobId || !formData.universityId) {
      toast.error("Please select both job and university");
      return;
    }
    if (!formData.salary || !formData.minCgpa || !formData.openings) {
      toast.error("Please fill salary, minimum CGPA and openings");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    try {
      await dispatch(
        sendJobToUniversity({
          jobId: Number(formData.jobId),
          jobUniversities: [
            {
              universityId: Number(formData.universityId),
              salary: Number(formData.salary),
              minCgpa: Number(formData.minCgpa),
              maxBacklogs: Number(formData.maxBacklogs || 0),
              openings: Number(formData.openings),
              description: formData.description.trim(),
            },
          ],
        }),
      ).unwrap();

      toast.success("Job request sent successfully");
      loadJobRequests();
      setFormData((prev) => ({
        ...prev,
        universityId: "",
        salary: "",
        minCgpa: "",
        maxBacklogs: "0",
        openings: "",
        description: "",
      }));
    } catch (error: any) {
      toast.error(error?.message || error || "Failed to send request");
    }
  };

  const handleReapply = async (request: any) => {
    try {
      setIsReapplying(request.id);
      await putAPI("/job-universities/reapply", {
        jobId: request.jobId,
        universityId: request.universityId,
        salary: request.salary,
        minCgpa: request.minCgpa,
        maxBacklogs: request.maxBacklogs,
        openings: request.openings,
        description: request.description
      });
      toast.success("Re-applied successfully");
      loadJobRequests();
    } catch (error: any) {
      toast.error(error?.message || "Failed to re-apply");
    } finally {
      setIsReapplying(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider shadow-sm">
            <CheckCircle2 size={12} className="animate-pulse" />
            Approved
          </div>
        );
      case "REJECTED":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider shadow-sm">
            <XCircle size={12} />
            Rejected
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider shadow-sm">
            <Timer size={12} className="animate-bounce" />
            Pending
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pb-20 animate-in fade-in duration-1000">
      <div className=" space-y-10">

        {/* Hero Header - Matching PostJob.tsx exactly */}
        <div className="p-4 md:p-10">
          <div className="company-hero-banner relative overflow-hidden group min-h-[320px] flex flex-col justify-center">
            <div className="hero-mesh">
              <div className="bubble-primary blur-[120px] opacity-40" />
              <div className="bubble-secondary blur-[100px] opacity-30" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse" />
            </div>
            <div className="hero-texture opacity-10" />

            <div className="relative z-10 space-y-6 max-w-3xl">
              <div className="hero-badge backdrop-blur-md bg-white/10 border-white/20">
                <Sparkles size={14} className="text-blue-200" />
                Job Syndication
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                Send Job <br />
                to University
              </h1>
              <p className="text-lg text-blue-50/80 font-medium leading-relaxed max-w-2xl">
                Distribute your job postings across targeted academic institutions and campus placement systems.
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-10 -mt-16 relative z-20">
          <div className="saas-card p-10 md:p-12 space-y-12 bg-card/90 backdrop-blur-xl shadow-2xl shadow-black/5">
            <form onSubmit={handleSubmit} className="space-y-12">

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider border border-primary/10">
                  <Target size={12} /> Syndication Logic
                </div>
                <h2 className="text-2xl font-black text-foreground tracking-tight">Channel Selection</h2>
                <p className="text-muted-foreground font-medium max-w-lg">Map your recruitment manifest to the appropriate academic destination.</p>
              </div>

              {/* Selection Section */}
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                <div className="space-y-4">
                  <label className="saas-label">Active Job Opportunity</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <select
                      className="saas-input h-14 !pl-16 appearance-none bg-muted/20 border-border/50 hover:border-primary/30 focus:bg-background focus:ring-8 focus:ring-primary/5 transition-all duration-300 outline-none cursor-pointer font-bold"
                      value={formData.jobId}
                      onChange={(e) => setFormData((prev) => ({ ...prev, jobId: e.target.value }))}
                    >
                      <option value="">Choose a manifest...</option>
                      {companyJobs.map((job: any) => (
                        <option key={job.id} value={job.id}>
                          {job.title} — ID: {String(job.id).slice(-6).toUpperCase()}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-muted-foreground pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="saas-label">Destination University</label>
                  <div className="relative group">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <select
                      className="saas-input h-14 !pl-16 appearance-none bg-muted/20 border-border/50 hover:border-primary/30 focus:bg-background focus:ring-8 focus:ring-primary/5 transition-all duration-300 outline-none cursor-pointer font-bold"
                      value={formData.universityId}
                      onChange={(e) => setFormData((prev) => ({ ...prev, universityId: e.target.value }))}
                      disabled={isUniversityLoading}
                    >
                      <option value="">
                        {isUniversityLoading ? "Syncing universities..." : "Select university campus..."}
                      </option>
                      {universities.map((uni: any) => (
                        <option key={uni.id} value={uni.id}>
                          {uni.name} (ID: {String(uni.id).slice(-6).toUpperCase()})
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-muted-foreground pointer-events-none" size={18} />
                  </div>
                </div>
              </div>

              {selectedJob && (
                <div className="animate-in slide-in-from-top-2 duration-500 flex items-center gap-5 rounded-[2rem] border border-primary/10 bg-primary/5 p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1 relative z-10">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Active Manifest Selection</h4>
                    <p className="text-sm font-bold text-foreground">
                      Syndicating <span className="text-primary italic">"{selectedJob.title}"</span> to the targeted university channel.
                    </p>
                  </div>
                </div>
              )}

              {/* Eligibility & Targeting Section */}
              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Calibration Parameters</h3>
                  <div className="h-px w-full bg-border/50" />
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-4">
                    <label className="saas-label">Annual Salary (INR)</label>
                    <div className="relative group">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 1200000"
                        className="saas-input h-14 !pl-16 bg-muted/20 border-border/50 hover:border-primary/30 focus:bg-background focus:ring-8 focus:ring-primary/5 transition-all outline-none"
                        value={formData.salary}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (Number(val) < 0) return;
                          setFormData((prev) => ({ ...prev, salary: val }));
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="saas-label">Min CGPA</label>
                    <div className="relative group">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g. 7.5"
                        className="saas-input h-14 !pl-16 bg-muted/20 border-border/50 hover:border-primary/30 focus:bg-background focus:ring-8 focus:ring-primary/5 transition-all outline-none"
                        value={formData.minCgpa}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (Number(val) < 0) return;
                          setFormData((prev) => ({ ...prev, minCgpa: val }));
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="saas-label">Max Backlogs</label>
                    <div className="relative group">
                      <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        className="saas-input h-14 !pl-16 bg-muted/20 border-border/50 hover:border-primary/30 focus:bg-background focus:ring-8 focus:ring-primary/5 transition-all outline-none"
                        value={formData.maxBacklogs}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (Number(val) < 0) return;
                          setFormData((prev) => ({ ...prev, maxBacklogs: val }));
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="saas-label">Openings</label>
                    <div className="relative group">
                      <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="number"
                        min="0"
                        placeholder="15"
                        className="saas-input h-14 !pl-16 bg-muted/20 border-border/50 hover:border-primary/30 focus:bg-background focus:ring-8 focus:ring-primary/5 transition-all outline-none"
                        value={formData.openings}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (Number(val) < 0) return;
                          setFormData((prev) => ({ ...prev, openings: val }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="saas-label">Syndication Instructions</label>
                <div className="relative group">
                  <AlignLeft className="absolute left-5 top-6 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                  <textarea
                    rows={6}
                    placeholder="Articulate specific requirements or university-specific details..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="saas-input !pl-16 py-6 bg-muted/20 border-border/50 hover:border-primary/30 focus:bg-background focus:ring-8 focus:ring-primary/5 transition-all resize-none leading-relaxed outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10">
                <div className="p-6 bg-primary/5 border border-primary/10 rounded-[2rem] flex items-start gap-4 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Info size={16} className="text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-[10px] font-black text-primary uppercase tracking-wider">Syndication Protocol</h5>
                    <p className="text-[11px] text-primary/70 font-bold leading-relaxed">
                      By confirming, this manifest will be instantly routed to the university's placement system.
                      Ensure all parameters are within legal and corporate compliance.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex items-center justify-center gap-4 px-12 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl hover:shadow-primary/30 hover:-translate-y-1.5 active:translate-y-0 transition-all duration-500 overflow-hidden w-full md:w-auto min-w-[240px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shine_2s_infinite] transition-transform" />
                  {loading ? (
                    <><Loader size="sm" /> Transmitting...</>
                  ) : (
                    <>Send Job Request <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Syndication History Section */}
        <div className="px-4 md:px-10 pb-20">
          <div className="saas-card p-0 overflow-hidden bg-card/90 backdrop-blur-xl shadow-2xl shadow-black/5">
            <div className="p-8 border-b border-border/40 bg-muted/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary">
                  <History size={18} />
                  <h2 className="text-xl font-black tracking-tight">Syndication History</h2>
                </div>
                <p className="text-xs text-muted-foreground font-medium">Monitoring the transmission status of your institutional job requests.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="saas-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Destination University</th>
                    <th>Manifest (Job Role)</th>
                    <th>Compensation</th>
                    <th className="text-center">Transmission Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {isRequestsLoading ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <Loader size="lg" />
                          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">Syncing History...</span>
                        </div>
                      </td>
                    </tr>
                  ) : jobRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-2 opacity-50">
                          <Target size={40} className="text-muted-foreground mb-2" />
                          <span className="text-sm font-bold">No history found</span>
                          <span className="text-xs text-muted-foreground">Sent requests will appear here for monitoring.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    jobRequests.map((req, idx) => (
                      <tr key={req.id} className="group hover:bg-primary/[0.02] transition-colors">
                        <td className="w-16 text-center font-black text-[10px] text-muted-foreground/50">
                          {(idx + 1).toString().padStart(2, "0")}
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/10">
                              <GraduationCap className="h-5 w-5 text-primary" />
                            </div>
                            <div className="space-y-0.5">
                              <div className="text-sm font-bold text-foreground truncate max-w-[200px]">
                                {req.university?.name || "Target Campus"}
                              </div>
                              <div className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                                <MapPin size={10} /> {req.university?.city}, {req.university?.state}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/10">
                              <Briefcase className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="space-y-0.5">
                              <div className="text-xs font-bold text-foreground">
                                {req.job?.title || "Syndicated Job"}
                              </div>
                              <div className="text-[9px] font-black text-blue-500/60 uppercase tracking-tight">
                                ID: {String(req.jobId).slice(-6).toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="inline-flex items-center gap-1 text-xs font-black text-foreground tracking-tight">
                            <IndianRupee size={12} className="text-primary/60" />
                            {(req.salary / 100000).toFixed(1)} <span className="text-[9px] text-muted-foreground ml-0.5">LPA</span>
                          </div>
                        </td>
                        <td className="text-center">
                          {getStatusBadge(req.status)}
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {req.status === "REJECTED" && (
                              <button
                                disabled={isReapplying === req.id}
                                onClick={() => handleReapply(req)}
                                className="p-2 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                                title="Retry Syndication"
                              >
                                {isReapplying === req.id ? (
                                  <RefreshCw size={14} className="animate-spin" />
                                ) : (
                                  <RefreshCw size={14} />
                                )}
                              </button>
                            )}
                            <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:text-primary transition-all shadow-sm">
                              <ExternalLink size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-border/40 bg-muted/5 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              <div className="flex items-center gap-4">
                <span>Successful Transmissions: {jobRequests.filter(r => r.status === "APPROVED").length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target size={12} className="text-primary" /> Syndication Log
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default SendJobUniversityRequest;