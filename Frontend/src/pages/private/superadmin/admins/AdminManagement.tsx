import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Search, CheckCircle, XCircle, ChevronRight, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/redux/store/store";
import type { RootState } from "@/redux/reducers/rootReducer";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminPageLayout } from "@/components/layout/AdminPageLayout";
import { PageHeader } from "@/components/PageHeader";
import Loader from "@/components/Loader";

import { fetchAdmins, updateAdminStatus } from "@/redux/thunks/superAdminThunk";

const AdminManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { admins, loading, isSubmitting } = useSelector((state: RootState) => state.superAdmin);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  const handleStatusChange = async (ids: number[], status: boolean) => {
    try {
      await dispatch(updateAdminStatus({ ids, status })).unwrap();
      toast.success(`Administrator ${status ? 'activated' : 'deactivated'} successfully.`);
    } catch (error: any) {
      toast.error(error || "Failed to update administrator status.");
    }
  };

  const filteredAdmins = admins.filter((a: any) =>
    `${a.firstname} ${a.lastname}`.toLowerCase().includes(search.trim().toLowerCase()) ||
    a.email.toLowerCase().includes(search.trim().toLowerCase())
  );


  return (
    <AdminPageLayout>
      <PageHeader
        title="Admin Control"
        description="Oversee and manage tactical administrators across all university nodes."
        badge="Access Control"
        icon={ShieldCheck}
        variant="indigo"
      />

      <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search administrators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 bg-card border-border/50 rounded-2xl shadow-sm focus:ring-primary/10 transition-all"
            />
          </div>

          <Button 
            className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[11px] gap-2 shadow-lg shadow-indigo-500/20"
            onClick={() => navigate("/superadmin/admins/register")}
          >
            <User className="size-4" /> Add Administrator
          </Button>
        </div>

        <div className="saas-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="w-20 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground py-5 pl-8">#</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground py-5">Administrator</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground py-5">Institution</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground py-5">Onboarding Step</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground py-5 text-center">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground py-5 text-right pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-24 text-center">
                      <Loader text="Synchronizing administrator records..." />
                    </TableCell>
                  </TableRow>
                ) : filteredAdmins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-40">
                        <ShieldCheck className="w-12 h-12" />
                        <span className="text-xs font-black uppercase tracking-widest">No administrators found</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdmins.map((admin: any, index: number) => (
                    <TableRow
                      key={admin.id}
                      className="border-border/50 hover:bg-muted/30 transition-all group"
                    >
                      <TableCell className="font-bold text-muted-foreground py-5 pl-8 tabular-nums">{String(index + 1).padStart(2, '0')}</TableCell>
                      <TableCell className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                             <User className="size-5" />
                          </div>
                          <div>
                            <span className="font-black text-foreground group-hover:text-indigo-600 transition-colors block leading-tight">
                              {admin.firstname} {admin.lastname}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground">{admin.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <span className="text-sm text-muted-foreground font-medium">
                          {admin.university?.name || "Global"}
                        </span>
                      </TableCell>
                      <TableCell className="py-5">
                         <div className="flex flex-col gap-1">
                            <span className={`text-[10px] font-black uppercase tracking-wider ${
                               admin.onboardingStep === 'COMPLETED' ? 'text-emerald-500' : 'text-amber-500'
                            }`}>
                               {admin.onboardingStep?.replace('_', ' ')}
                            </span>
                            <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
                               <div 
                                  className={`h-full transition-all duration-500 ${
                                     admin.onboardingStep === 'COMPLETED' ? 'bg-emerald-500 w-full' : 
                                     admin.onboardingStep === 'CREATE_PROFILE' ? 'bg-amber-500 w-3/4' :
                                     admin.onboardingStep === 'UNIVERSITY_ACCEPTANCE' ? 'bg-indigo-500 w-1/2' : 'bg-slate-300 w-1/4'
                                  }`}
                               />
                            </div>
                         </div>
                      </TableCell>
                      <TableCell className="text-center py-5">
                         <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                           admin.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                         }`}>
                           {admin.status}
                         </span>
                      </TableCell>
                      <TableCell className="text-right py-5 pr-8">
                        <div className="flex justify-end gap-2">
                          {admin.status === 'INACTIVE' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 gap-1.5 font-black text-[10px] uppercase tracking-wider"
                              onClick={() => void handleStatusChange([admin.id], true)}
                              disabled={isSubmitting}
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Activate
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-500/10 gap-1.5 font-black text-[10px] uppercase tracking-wider"
                              onClick={() => void handleStatusChange([admin.id], false)}
                              disabled={isSubmitting}
                            >
                              <XCircle className="w-3.5 h-3.5" /> Deactivate
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default AdminManagement;
