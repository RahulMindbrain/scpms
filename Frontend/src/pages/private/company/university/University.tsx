import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  GraduationCap,
  MapPin,
  Search,
  ChevronRight,
} from "lucide-react";

import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/redux/reducers/rootReducer";
import type { AppDispatch } from "@/redux/store/store";
import { fetchCompanyRequests, reapplyUniversity, requestUniversity } from "@/redux/thunks/superadmin/companyUniversityThunk";
import { getAPI } from "@/apis/api";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const UniversityRequest = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  const [universities, setUniversities] = useState<any[]>([]);
  const [isUniversityLoading, setIsUniversityLoading] = useState(false);
  const [reapplyingUniversityId, setReapplyingUniversityId] = useState<number | null>(null);

  const companyUniversityState = useSelector((state: RootState) => state.companyUniversity);

  const requests = companyUniversityState?.requests || [];
  const loading = companyUniversityState?.loading || false;

  useEffect(() => {
    dispatch(fetchCompanyRequests());
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

  const filteredUniversities = useMemo(() => {
    return universities.filter((u: any) =>
      u?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [universities, search]);

  const handleRequest = async (universityId: number) => {
    try {
      await dispatch(requestUniversity([universityId])).unwrap();
      toast.success("Request sent successfully");
      dispatch(fetchCompanyRequests());
    } catch (error: any) {
      toast.error(error?.message || error || "Failed to send request");
    }
  };

  const handleReapply = async (universityId: number) => {
    try {
      setReapplyingUniversityId(universityId);
      await dispatch(reapplyUniversity([universityId])).unwrap();
      toast.success("Reapplied successfully");
      dispatch(fetchCompanyRequests());
    } catch (error: any) {
      toast.error(error?.message || error || "Failed to reapply request");
    } finally {
      setReapplyingUniversityId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 uppercase text-[10px] font-bold">Active</Badge>;
      case "REJECTED":
        return <Badge variant="destructive" className="uppercase text-[10px] font-bold">Rejected</Badge>;
      default:
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200 uppercase text-[10px] font-bold">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8 font-sans text-foreground">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HERO SECTION - Styled after the "Corporate Partners" banner */}
        <div className="relative overflow-hidden rounded-[32px] border border-border bg-linear-to-br from-orange-100/50 to-amber-100/30 p-10 dark:from-orange-950/20 dark:to-amber-950/10">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">University Access</span>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-500 rounded-xl shadow-lg shadow-orange-200">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                Academic Partners
              </h1>
            </div>
            
            <p className="max-w-2xl text-lg text-muted-foreground">
              Connect with educational institutions to expand your placement network and reach top-tier student talent.
            </p>
          </div>
        </div>

        {/* SEARCH BAR - Floating Style */}
        <div className="relative max-w-md group">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-blue-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for universities..."
            className="h-14 rounded-2xl border-border bg-card pl-12 text-base transition-all focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40"
          />
        </div>

        {/* TABLE SECTION - Based on the reference image table */}
        <Card className="overflow-hidden rounded-[24px] border-border bg-card shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">#</th>
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">University</th>
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Location</th>
                    <th className="px-8 py-5 text-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                    <th className="px-8 py-5 text-right text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {(loading || isUniversityLoading) && (
                    <tr>
                      <td colSpan={5} className="px-8 py-8 text-center text-sm text-muted-foreground">
                        Loading universities...
                      </td>
                    </tr>
                  )}
                  {!loading && !isUniversityLoading && filteredUniversities.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-8 text-center text-sm text-muted-foreground">
                        No universities found for the current search.
                      </td>
                    </tr>
                  )}
                  {filteredUniversities.map((uni, idx) => {
                    const req = requests.find((r: any) => r.universityId === uni.id);

                    return (
                      <tr key={uni.id} className="group transition-colors hover:bg-muted/40">
                        <td className="px-8 py-6 text-sm font-medium text-muted-foreground">
                          {(idx + 1).toString().padStart(2, '0')}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-orange-200/50 bg-orange-100/60 dark:border-orange-900/40 dark:bg-orange-900/20">
                              <Building2 className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                              <div className="font-bold text-foreground">{uni.name}</div>
                              <div className="text-xs text-muted-foreground">ID: {uni.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1.5 h-3.5 w-3.5 text-muted-foreground/70" />
                            {uni.city}, {uni.state}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          {req ? getStatusBadge(req.status) : <span className="text-[10px] font-bold uppercase text-muted-foreground/60">No Request</span>}
                        </td>
                        <td className="px-8 py-6 text-right">
                          {!req && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRequest(uni.id)}
                              className="text-xs font-bold uppercase text-blue-600 hover:bg-blue-100/50 hover:text-blue-700 dark:hover:bg-blue-900/30"
                            >
                              Send Request <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          )}
                          {req?.status === "REJECTED" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={reapplyingUniversityId === uni.id}
                              onClick={() => handleReapply(uni.id)}
                              className="text-xs font-bold uppercase text-orange-600 hover:bg-orange-100/60 hover:text-orange-700 dark:hover:bg-orange-900/30"
                            >
                              {reapplyingUniversityId === uni.id ? "Reapplying..." : "Reapply"}
                            </Button>
                          )}
                          {req && req.status !== "REJECTED" && (
                            <div className="text-slate-300">
                              <ChevronRight className="w-5 h-5 ml-auto" />
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UniversityRequest;