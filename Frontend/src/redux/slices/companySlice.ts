import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCompanies,
  fetchInactiveCompanies,
  activateCompanies,
  fetchCompanyProfile,
  createCompanyProfile,
  updateCompanyProfile,
  fetchCompanyJobs,
  fetchJobApplications,
  updateJobApplicationStatus,
  fetchJobsByCompanyId,
  updateCompanyJob,
  deleteCompanyJob,
  postJob,
  sendBulkMail,
} from "../thunks/companyThunk";

interface CompanyState {
  companies: any[];
  inactiveCompanies: any[];
  profile: any | null;
  jobs: any[];
  applications: any[];
  statusCounts: any[];
  loading: boolean;
  error: string | null;
  meta: any;
}

const initialState: CompanyState = {
  companies: [],
  inactiveCompanies: [],
  profile: null,
  jobs: [],
  applications: [],
  statusCounts: [],
  loading: false,
  error: null,
  meta: null,
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // ✅ Companies
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.companies;
        state.meta = action.payload.meta;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Inactive Companies
      .addCase(fetchInactiveCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInactiveCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.inactiveCompanies = action.payload.inactiveCompanies;
        state.meta = action.payload.meta;
      })
      .addCase(fetchInactiveCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Activate
      .addCase(activateCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(activateCompanies.fulfilled, (state) => {
        state.loading = false;
      })

      // ✅ Profile
      .addCase(fetchCompanyProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createCompanyProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(createCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateCompanyProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Jobs
      .addCase(fetchCompanyJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.meta = action.payload.meta;
      })
      .addCase(fetchCompanyJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchJobsByCompanyId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobsByCompanyId.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.meta = action.payload.meta;
      })
      .addCase(fetchJobsByCompanyId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCompanyJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCompanyJob.fulfilled, (state, action) => {
        state.loading = false;
        const updatedJob = action.payload;
        if (updatedJob) {
          state.jobs = state.jobs.map((job) =>
            job.id === updatedJob.id ? updatedJob : job
          );
        }
      })
      .addCase(updateCompanyJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Post Job
      .addCase(postJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(postJob.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(postJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCompanyJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCompanyJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      })
      .addCase(deleteCompanyJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Applications
      .addCase(fetchJobApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.applications;
        state.statusCounts = action.payload.statusCounts;
        state.meta = action.payload.meta;
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Update Status
      .addCase(updateJobApplicationStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateJobApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;

        state.applications = state.applications.map((app) =>
          app.id === updated.id ? { ...app, status: updated.status } : app
        );
      })
      .addCase(updateJobApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Mail
      .addCase(sendBulkMail.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendBulkMail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendBulkMail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default companySlice.reducer;