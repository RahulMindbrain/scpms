import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  GraduationCap,
  MapPin,
  Search,
  Send,
  CheckCircle2,
  Clock3,
  XCircle,
  RefreshCcw,
  ChevronRight,
} from "lucide-react";

import { motion } from "framer-motion";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/redux/reducers/rootReducer";
import type { AppDispatch } from "@/redux/store/store";
import { fetchUniversities } from "@/redux/thunks/superadmin/universityThunks";
import { fetchCompanyRequests, requestUniversity } from "@/redux/thunks/superadmin/companyUniversityThunk";
import { postAPI } from "@/apis/api";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const UniversityRequest = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  const [reapplying, setReapplying] = useState<number | null>(null);

  const superAdminState = useSelector((state: RootState) => state.superAdmin);
  const companyUniversityState = useSelector((state: RootState) => state.companyUniversity);

  const universities = superAdminState?.universities || [];
  const requests = companyUniversityState?.requests || [];
  const loading = companyUniversityState?.loading || false;

  useEffect(() => {
    dispatch(fetchUniversities());
    dispatch(fetchCompanyRequests());
  }, [dispatch]);

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
      toast.error(error || "Failed to send request");
    }
  };

  const handleReapply = async (universityId: number) => {
    try {
      setReapplying(universityId);
      await postAPI("/company/reapply-university", { universityIds: [universityId] });
      toast.success("Reapplied successfully");
      dispatch(fetchCompanyRequests());
    } catch (error: any) {
      toast.error(error?.message || "Failed to reapply");
    } finally {
      setReapplying(null);
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
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HERO SECTION - Styled after the "Corporate Partners" banner */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#FFF9F0] to-[#FFF1E0] border border-orange-100 p-10">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-200 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">University Access</span>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-500 rounded-xl shadow-lg shadow-orange-200">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Academic Partners
              </h1>
            </div>
            
            <p className="text-slate-500 text-lg max-w-2xl">
              Connect with educational institutions to expand your placement network and reach top-tier student talent.
            </p>
          </div>
        </div>

        {/* SEARCH BAR - Floating Style */}
        <div className="relative max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for universities..."
            className="pl-12 h-14 bg-white border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 transition-all text-base"
          />
        </div>

        {/* TABLE SECTION - Based on the reference image table */}
        <Card className="border-slate-200 shadow-sm rounded-[24px] overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">#</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">University</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Location</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUniversities.map((uni, idx) => {
                    const req = requests.find((r: any) => r.universityId === uni.id);
                    const isRejected = req?.status === "REJECTED";

                    return (
                      <tr key={uni.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6 text-slate-400 font-medium text-sm">
                          {(idx + 1).toString().padStart(2, '0')}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-100">
                              <Building2 className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{uni.name}</div>
                              <div className="text-xs text-slate-400">ID: {uni.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center text-slate-500 text-sm">
                            <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-300" />
                            {uni.city}, {uni.state}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          {req ? getStatusBadge(req.status) : <span className="text-slate-300 text-[10px] font-bold uppercase">No Request</span>}
                        </td>
                        <td className="px-8 py-6 text-right">
                          {!req ? (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRequest(uni.id)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold text-xs uppercase"
                            >
                              Send Request <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          ) : isRejected ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={reapplying === uni.id}
                              onClick={() => handleReapply(uni.id)}
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-bold text-xs uppercase"
                            >
                              {reapplying === uni.id ? "Processing..." : "Reapply"}
                            </Button>
                          ) : (
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