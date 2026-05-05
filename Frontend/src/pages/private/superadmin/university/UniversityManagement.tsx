import { useEffect, useState } from "react";
import { Building2, Search, Plus, MapPin, Mail, ChevronRight, Pencil } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/redux/store/store";
import type { RootState } from "@/redux/reducers/rootReducer";
import { fetchUniversities, addUniversity } from "@/redux/thunks/superAdminThunk";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const UniversityManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { universities, loading, isSubmitting } = useSelector((state: RootState) => state.superAdmin);
  
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newUniversity, setNewUniversity] = useState({
    name: "",
    domain: "",
    address: "",
    contactEmail: "",
  });

  useEffect(() => {
    dispatch(fetchUniversities());
  }, [dispatch]);

  const filteredUniversities = universities.filter((u: any) =>
    u.name.toLowerCase().includes(search.trim().toLowerCase()) ||
    u.domain?.toLowerCase().includes(search.trim().toLowerCase())
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUniversity.name || !newUniversity.domain) {
      toast.error("Name and Domain are required.");
      return;
    }

    try {
      await dispatch(addUniversity(newUniversity)).unwrap();
      toast.success("University registered successfully.");
      setNewUniversity({ name: "", domain: "", address: "", contactEmail: "" });
      setIsCreateOpen(false);
    } catch (error: any) {
      toast.error(error || "Failed to register university.");
    }
  };

  return (
    <AdminPageLayout>
      <PageHeader
        title="University Registry"
        description="Global directory of participating academic institutions and university nodes."
        badge="Node Management"
        icon={Building2}
        variant="blue"
      >
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95">
              <Plus className="w-4 h-4 mr-2" /> Add University
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none rounded-3xl">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">New Institution</DialogTitle>
                <DialogDescription className="text-blue-100/70 font-medium">
                  Register a new university node into the CPMS ecosystem.
                </DialogDescription>
              </DialogHeader>
            </div>
            <form onSubmit={handleAdd} className="p-8 space-y-4 bg-card">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">University Name</label>
                <Input
                  required
                  placeholder="e.g. Stanford University"
                  value={newUniversity.name}
                  onChange={(e) => setNewUniversity({ ...newUniversity, name: e.target.value })}
                  className="h-12 bg-muted/30 border-border/50 rounded-xl focus:ring-primary/20 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Official Domain</label>
                <Input
                  required
                  placeholder="e.g. stanford.edu"
                  value={newUniversity.domain}
                  onChange={(e) => setNewUniversity({ ...newUniversity, domain: e.target.value })}
                  className="h-12 bg-muted/30 border-border/50 rounded-xl focus:ring-primary/20 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Contact Email</label>
                <Input
                  type="email"
                  placeholder="admin@university.edu"
                  value={newUniversity.contactEmail}
                  onChange={(e) => setNewUniversity({ ...newUniversity, contactEmail: e.target.value })}
                  className="h-12 bg-muted/30 border-border/50 rounded-xl focus:ring-primary/20 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Location Address</label>
                <Input
                  placeholder="Street, City, State"
                  value={newUniversity.address}
                  onChange={(e) => setNewUniversity({ ...newUniversity, address: e.target.value })}
                  className="h-12 bg-muted/30 border-border/50 rounded-xl focus:ring-primary/20 transition-all font-bold"
                />
              </div>
              <DialogFooter className="gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 h-12 rounded-xl font-bold"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black shadow-lg shadow-blue-500/20"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader size="sm" /> : "Register Node"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search institutions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 bg-card border-border/50 rounded-2xl shadow-sm focus:ring-primary/10 transition-all"
            />
          </div>
        </div>

        <div className="saas-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="w-20 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground py-5 pl-8">#</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground py-5">University</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground py-5">Contact</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground py-5">Location</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground py-5 text-right pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-24 text-center">
                      <Loader text="Retrieving institutional records..." />
                    </TableCell>
                  </TableRow>
                ) : filteredUniversities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-40">
                        <Building2 className="w-12 h-12" />
                        <span className="text-xs font-black uppercase tracking-widest">No universities registered</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUniversities.map((uni: any, index: number) => (
                    <TableRow key={uni.id} className="border-border/50 hover:bg-muted/30 transition-all group">
                      <TableCell className="font-bold text-muted-foreground py-5 pl-8 tabular-nums">{String(index + 1).padStart(2, '0')}</TableCell>
                      <TableCell className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                             <Building2 className="size-5" />
                          </div>
                          <div>
                            <span className="font-black text-foreground group-hover:text-blue-600 transition-colors block leading-tight">
                              {uni.name}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{uni.domain}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                         <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{uni.contactEmail || "N/A"}</span>
                            <span className="text-[10px] text-muted-foreground">Direct Admin Channel</span>
                         </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                          <MapPin className="size-3.5" />
                          {uni.address || "Location Pending"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-5 pr-8">
                         <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="size-9 rounded-xl text-blue-600">
                               <Pencil className="size-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="size-9 rounded-xl text-muted-foreground">
                               <ChevronRight className="size-4" />
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

export default UniversityManagement;
