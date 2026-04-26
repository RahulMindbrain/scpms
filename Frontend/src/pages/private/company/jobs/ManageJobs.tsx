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
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
        {/* <Button className="font-bold px-6 py-6 rounded-2xl shadow-lg shadow-blue-500/20">
          <Plus className="w-5 h-5 mr-2" /> Post New Job
        </Button> */}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Your Job Postings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Job Title</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Package</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Location</th>
                {/* <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Applicants</th> */}
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Deadline</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                {/* <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center">
                    <Loader text="Loading your job postings..." />
                  </td>
                </tr>
              ) : jobs?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500 font-medium">
                    No jobs found. Post a new job to get started.
                  </td>
                </tr>
              ) : (
                jobs?.map((job: any) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-5 font-bold text-slate-800">{job.title}</td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-600">{formatSalary(job.salary)}</td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-600">{job.location}</td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-600 text-center">0</td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-500">
                      {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric'
                      }) : 'N/A'}
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant={
                        job.status === 'APPROVED' || job.status === 'Active' ? 'default' : 
                        job.status === 'REJECTED' || job.status === 'Closed' ? 'danger' : 
                        'outline'
                      }>
                        {job.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
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

