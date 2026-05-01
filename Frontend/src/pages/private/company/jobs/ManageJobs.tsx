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
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
        {/* <Button className="font-bold px-6 py-6 rounded-2xl shadow-lg shadow-blue-500/20">
          <Plus className="w-5 h-5 mr-2" /> Post New Job
        </Button> */}
      </div>

      <div className="bg-[#1e1f26] rounded-2xl border border-[rgba(255,255,255,0.07)] overflow-hidden">
        <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
          <h2 className="text-lg font-bold text-[#e2e2eb]">Your Job Postings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[rgba(255,255,255,0.03)]">
                <th className="px-6 py-4 text-xs font-bold text-[#908fa0] uppercase tracking-widest">Job Title</th>
                <th className="px-6 py-4 text-xs font-bold text-[#908fa0] uppercase tracking-widest">Package</th>
                <th className="px-6 py-4 text-xs font-bold text-[#908fa0] uppercase tracking-widest">Location</th>
                {/* <th className="px-6 py-4 text-xs font-bold text-[#908fa0] uppercase tracking-widest text-center">Applicants</th> */}
                <th className="px-6 py-4 text-xs font-bold text-[#908fa0] uppercase tracking-widest">Deadline</th>
                <th className="px-6 py-4 text-xs font-bold text-[#908fa0] uppercase tracking-widest">Status</th>
                {/* <th className="px-6 py-4 text-xs font-bold text-[#908fa0] uppercase tracking-widest text-right">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center">
                    <Loader text="Loading your job postings..." />
                  </td>
                </tr>
              ) : jobs?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-[#908fa0] font-medium">
                    No jobs found. Post a new job to get started.
                  </td>
                </tr>
              ) : (
                jobs?.map((job: any) => (
                  <tr key={job.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors group border-b border-[rgba(255,255,255,0.04)] last:border-0">
                    <td className="px-6 py-3.5 font-bold text-[#e2e2eb]">{job.title}</td>
                    <td className="px-6 py-3.5 text-xs font-medium text-[#c7c4d7]">{formatSalary(job.salary)}</td>
                    <td className="px-6 py-3.5 text-xs font-medium text-[#c7c4d7]">{job.location}</td>
                    <td className="px-6 py-3.5 text-xs font-bold text-[#c7c4d7] text-center">0</td>
                    <td className="px-6 py-3.5 text-xs font-medium text-[#908fa0]">
                      {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric'
                      }) : 'N/A'}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={
                        job.status === 'APPROVED' || job.status === 'Active' ? 'default' : 
                        job.status === 'REJECTED' || job.status === 'Closed' ? 'danger' : 
                        'outline'
                      } className="px-2 py-0.5 text-[10px]">
                        {job.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="p-1.5 text-[#908fa0] hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-[#908fa0] hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-[#908fa0] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
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

