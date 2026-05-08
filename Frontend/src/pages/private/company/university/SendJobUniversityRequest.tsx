import { useEffect, useMemo, useState } from "react";
import { Building2, ChevronRight, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import type { RootState } from "@/redux/reducers/rootReducer";
import type { AppDispatch } from "@/redux/store/store";
import { fetchCompanyJobs } from "@/redux/thunks/companyThunk";
import { sendJobToUniversity } from "@/redux/thunks/superadmin/companyUniversityThunk";
import { getAPI } from "@/apis/api";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="min-h-screen bg-background p-8 text-foreground">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-[28px] border border-border bg-linear-to-br from-blue-100/50 to-indigo-100/30 p-8 dark:from-blue-950/20 dark:to-indigo-950/10">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                Company Request
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Send Job to University</h1>
            <p className="text-sm text-muted-foreground">
              Map a job to a university and share eligibility details in one request.
            </p>
          </div>
        </div>

        <Card className="rounded-2xl border-border bg-card shadow-sm">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Select Job
                  </label>
                  <select
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                    value={formData.jobId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, jobId: e.target.value }))}
                  >
                    <option value="">Choose job</option>
                    {companyJobs.map((job: any) => (
                      <option key={job.id} value={job.id}>
                        {job.title} (#{job.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Select University
                  </label>
                  <select
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                    value={formData.universityId}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, universityId: e.target.value }))
                    }
                    disabled={isUniversityLoading}
                  >
                    <option value="">
                      {isUniversityLoading ? "Loading universities..." : "Choose university"}
                    </option>
                    {universities.map((uni: any) => (
                      <option key={uni.id} value={uni.id}>
                        {uni.name} (#{uni.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedJob && (
                <div className="rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-3 text-xs text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-300">
                  Selected job: <span className="font-semibold">{selectedJob.title}</span> (#
                  {selectedJob.id})
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  type="number"
                  placeholder="Salary (e.g. 1200000)"
                  value={formData.salary}
                  onChange={(e) => setFormData((prev) => ({ ...prev, salary: e.target.value }))}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Min CGPA (e.g. 7.0)"
                  value={formData.minCgpa}
                  onChange={(e) => setFormData((prev) => ({ ...prev, minCgpa: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Max Backlogs (e.g. 1)"
                  value={formData.maxBacklogs}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, maxBacklogs: e.target.value }))
                  }
                />
                <Input
                  type="number"
                  placeholder="Openings (e.g. 5)"
                  value={formData.openings}
                  onChange={(e) => setFormData((prev) => ({ ...prev, openings: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Write a short opportunity description..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="text-xs font-bold uppercase">
                  {loading ? "Sending..." : "Send Request"}
                  {!loading && <Send className="ml-2 h-4 w-4" />}
                  {loading && <ChevronRight className="ml-2 h-4 w-4 animate-pulse" />}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

 
      </div>
    </div>
  );
};

export default SendJobUniversityRequest;
