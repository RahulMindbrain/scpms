import React, { useEffect, useState } from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanyJobs } from '@/redux/thunks/companyThunk';
import type { RootState } from '@/redux/reducers/rootReducer';
import type { AppDispatch } from '@/redux/store/store';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Loader from '@/components/Loader';

const ManageJobs: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, meta } = useSelector((state: RootState) => state.company);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchCompanyJobs({ page }));
  }, [dispatch, page]);

  const formatSalary = (salary: number) => {
    if (salary >= 100000) {
      return `${(salary / 100000).toFixed(2)} LPA`;
    }
    return `${salary} INR`;
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Manage Job Drives</h1>
          <p className="text-sm text-muted-foreground font-medium">View and manage all your active and past recruitment drives.</p>
        </div>
      </div>

      <div className="saas-table-container">
        <div className="px-6 py-4 border-b border-border/50 bg-muted/20">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Your Job Postings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Package</th>
                <th>Location</th>
                <th>Deadline</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Loader text="Loading your job postings..." />
                  </td>
                </tr>
              ) : jobs?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-muted-foreground font-medium">
                    No jobs found. Post a new job to get started.
                  </td>
                </tr>
              ) : (
                jobs?.map((job: any) => (
                  <tr key={job.id}>
                    <td className="font-bold text-foreground">{job.title}</td>
                    <td className="text-xs">{formatSalary(job.salary)}</td>
                    <td className="text-xs">{job.location}</td>
                    <td className="text-xs text-muted-foreground">
                      {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric'
                      }) : 'N/A'}
                    </td>
                    <td>
                      <Badge variant={
                        job.status === 'APPROVED' || job.status === 'Active' ? 'default' : 
                        job.status === 'REJECTED' || job.status === 'Closed' ? 'destructive' : 
                        'outline'
                      } className="px-2 py-0.5 text-[10px] font-bold">
                        {job.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  href="#"
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {[...Array(meta.totalPages)].map((_, i) => {
                const pageNumber = i + 1;
                // Basic logic to show current, first, last, and neighbors
                if (
                  pageNumber === 1 || 
                  pageNumber === meta.totalPages || 
                  (pageNumber >= page - 1 && pageNumber <= page + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={page === pageNumber}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(pageNumber);
                        }}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  pageNumber === page - 2 || 
                  pageNumber === page + 2
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext 
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < meta.totalPages) setPage(page + 1);
                  }}
                  href="#"
                  className={page === meta.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;

