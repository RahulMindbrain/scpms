import React, { useEffect, useState } from "react"
import {
  Edit3,
  Trash2,
  Search,
  Filter,
  Plus,
  Briefcase,
  MapPin,
  IndianRupee,
  Calendar,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useDispatch, useSelector } from "react-redux"
import { fetchCompanyJobs } from "@/redux/thunks/companyThunk"
import type { RootState } from "@/redux/reducers/rootReducer"
import type { AppDispatch } from "@/redux/store/store"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Link } from "react-router-dom"
import Loader from "@/components/Loader"

const ManageJobs: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { jobs, loading, meta } = useSelector(
    (state: RootState) => state.company
  )
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  // Modal States

  useEffect(() => {
    dispatch(fetchCompanyJobs({ page }))
  }, [dispatch, page])

  const formatSalary = (salary: number) => {
    if (salary >= 100000) {
      return `${(salary / 100000).toFixed(2)} LPA`
    }
    return `${salary} INR`
  }

  const filteredJobs = jobs?.filter(
    (job: any) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen animate-in pb-20 duration-700 fade-in">
      {/* Hero Header */}
      <div className="p-4 md:p-8">
        <div className="company-hero-banner group relative overflow-hidden">
          <div className="hero-mesh">
            <div className="bubble-primary" />
            <div className="bubble-secondary" />
          </div>
          <div className="hero-texture" />

          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-4">
              <div className="hero-badge">
                <Sparkles size={12} className="animate-pulse" />
                Management Console
              </div>
              <h1 className="hero-title">
                Manage Your <br />
                <span>Job Drives</span>
              </h1>
              <p className="hero-description">
                Monitor active recruitment cycles, review candidate progress,
                and manage your organization's job postings in one place.
              </p>
            </div>

            <Link
              to="/company/post-job"
              className="group relative flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-xs font-black tracking-widest text-primary uppercase transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:translate-y-0"
            >
              Post New Drive{" "}
              <Plus
                size={16}
                className="transition-transform duration-300 group-hover:rotate-90"
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 px-4 md:px-8">
        {/* Search & Stats Bar */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="group relative max-w-md flex-1">
            <Search
              className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="saas-input-with-icon w-full rounded-2xl border border-border bg-card py-3 pr-4 text-sm font-medium shadow-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-6 py-2.5 shadow-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                {jobs?.length || 0} Total Postings
              </span>
            </div>
            {/* <button className="p-3 bg-card border border-border rounded-2xl hover:bg-muted transition-colors shadow-sm">
              <Filter size={18} className="text-muted-foreground" />
            </button> */}
          </div>
        </div>

        {/* Jobs Grid/List */}
        <div className="saas-card overflow-hidden border-none p-0 shadow-2xl shadow-primary/5">
          <div className="overflow-x-auto">
            <table className="saas-table border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-muted/5">
                  <th className="px-8 py-5">Position Details</th>
                  <th className="px-6 py-5">Compensation</th>
                  <th className="px-6 py-5">Location</th>
                  <th className="px-6 py-5">Date Posted</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <Loader text="Fetching your recruitment drives..." />
                    </td>
                  </tr>
                ) : filteredJobs?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="rounded-full bg-muted/20 p-4">
                          <Briefcase
                            size={32}
                            className="text-muted-foreground"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Try adjusting your search or{" "}
                            <Link
                              to="/company/post-job"
                              className="font-bold text-primary hover:underline"
                            >
                              post a new drive
                            </Link>
                            .
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredJobs?.map((job: any) => (
                    <tr
                      key={job.id}
                      className="group transition-colors hover:bg-muted/5"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-black text-foreground transition-colors group-hover:text-primary">
                            {job.title}
                          </span>
                          <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                            <Plus size={10} className="text-primary" /> ID:{" "}
                            {String(job.id).slice(-8).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 font-bold text-foreground">
                          <IndianRupee size={14} className="text-primary" />
                          <span className="text-sm">
                            {formatSalary(job.salary)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 font-semibold text-muted-foreground">
                          <MapPin size={14} />
                          <span className="text-xs">{job.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 font-semibold text-muted-foreground">
                          <Calendar size={14} />
                          <span className="text-xs">
                            {job.createdAt
                              ? new Date(job.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                }
                              )
                              : "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <Badge
                          className={`rounded-full border px-3 py-1 text-[10px] font-black tracking-widest uppercase shadow-sm ${job.status === "APPROVED" || job.status === "Active"
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                              : job.status === "REJECTED" ||
                                job.status === "Closed"
                                ? "border-rose-500/20 bg-rose-500/10 text-rose-600"
                                : "border-primary/20 bg-primary/10 text-primary"
                            } `}
                        >
                          {job.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            to={`/company/send-job-to-university?jobId=${job.id}`}
                            className="flex items-center gap-2 rounded-xl bg-blue-500/10 px-4 py-2 text-[10px] font-black tracking-widest text-blue-600 uppercase shadow-sm transition-all hover:bg-blue-500 hover:text-white"
                            title="Send Job to University"
                          >
                            Send
                          </Link>
                          <Link
                            to={`/company/post-job?jobId=${job.id}`}
                            className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-[10px] font-black tracking-widest text-emerald-600 uppercase shadow-sm transition-all hover:bg-emerald-500 hover:text-white"
                            title="Modify Drive"
                          >
                            <Edit3 size={14} /> Modify
                          </Link>
                          <button
                            className="rounded-xl p-2.5 text-muted-foreground transition-all hover:bg-rose-500/10 hover:text-rose-500"
                            title="Delete Drive"
                          >
                            <Trash2 size={18} />
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

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="mt-12 flex justify-center pb-12">
            <Pagination>
              <PaginationContent className="rounded-2xl border border-border bg-card p-1 shadow-sm">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault()
                      if (page > 1) setPage(page - 1)
                    }}
                    href="#"
                    className={`rounded-xl ${page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                  />
                </PaginationItem>

                {[...Array(meta.totalPages)].map((_, i) => {
                  const pageNumber = i + 1
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
                            e.preventDefault()
                            setPage(pageNumber)
                          }}
                          className={`rounded-xl ${page === pageNumber ? "bg-primary text-white" : "cursor-pointer hover:bg-muted"}`}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  } else if (
                    pageNumber === page - 2 ||
                    pageNumber === page + 2
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }
                  return null
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault()
                      if (page < meta.totalPages) setPage(page + 1)
                    }}
                    href="#"
                    className={`rounded-xl ${page === meta.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Modals */}

      {/* View & Edit modals removed as per user request to move logic to PostJob wizard */}
    </div>
  )
}

export default ManageJobs
