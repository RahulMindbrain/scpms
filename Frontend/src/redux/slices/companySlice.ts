import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCompanies,
  fetchInactiveCompanies,
  activateCompanies,
  fetchCompanyProfile,
  createCompanyProfile,
  updateCompanyProfile,
  postJob,
  fetchCompanyJobs,
  fetchJobApplications,
  updateJobApplicationStatus,
  fetchJobsByCompanyId,
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
      .addCase(fetchInactiveCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.inactiveCompanies = action.payload.inactiveCompanies;
        state.meta = action.payload.meta;
      })

      // ✅ Activate
      .addCase(activateCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(activateCompanies.fulfilled, (state) => {
        state.loading = false;
      })

      // ✅ Profile
      .addCase(fetchCompanyProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(createCompanyProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(updateCompanyProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })

      // ✅ Jobs
      .addCase(fetchCompanyJobs.fulfilled, (state, action) => {
        state.jobs = action.payload.jobs;
        state.meta = action.payload.meta;
      })
      .addCase(fetchJobsByCompanyId.fulfilled, (state, action) => {
        state.jobs = action.payload.jobs;
        state.meta = action.payload.meta;
      })

      // ✅ Applications
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.applications = action.payload.applications;
        state.statusCounts = action.payload.statusCounts;
        state.meta = action.payload.meta;
      })

      // ✅ Update Status
      .addCase(updateJobApplicationStatus.fulfilled, (state, action) => {
        const updated = action.payload;

        state.applications = state.applications.map((app) =>
          app.id === updated.id ? { ...app, status: updated.status } : app
        );
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