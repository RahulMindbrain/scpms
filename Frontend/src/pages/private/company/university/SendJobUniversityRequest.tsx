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
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import type { RootState } from "@/redux/reducers/rootReducer";
import type { AppDispatch } from "@/redux/store/store";
import { fetchCompanyJobs } from "@/redux/thunks/companyThunk";
import { sendJobToUniversity } from "@/redux/thunks/superadmin/companyUniversityThunk";
import { getAPI } from "@/apis/api";
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
      </div>
    </div>


  );
};

export default SendJobUniversityRequest;