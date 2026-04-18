import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
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
  fetchJobsByCompanyId
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
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
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
      // Fetch Active Companies
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.companies = action.payload.data.data;
        state.meta = action.payload.data.meta;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Inactive Companies
      .addCase(fetchInactiveCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInactiveCompanies.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.inactiveCompanies = action.payload.data.data;
        // Optionally update meta if inactive companies call also returns it
        if (action.payload.data.meta) {
          state.meta = action.payload.data.meta;
        }
      })
      .addCase(fetchInactiveCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Activate Companies
      .addCase(activateCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateCompanies.fulfilled, (state) => {
        state.loading = false;
        // After activation, we typically might want to refresh lists, 
        // but here we just stop loading. The component should probably re-fetch.
      })
      .addCase(activateCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Company Profile
      .addCase(fetchCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.profile = action.payload?.data || action.payload; // accommodate API response
      })
      .addCase(fetchCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Company Profile
      .addCase(createCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompanyProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.profile = action.payload?.data || action.payload;
      })
      .addCase(createCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Company Profile
      .addCase(updateCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompanyProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.profile = action.payload?.data || action.payload;
      })
      .addCase(updateCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Post Job
      .addCase(postJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postJob.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(postJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Company Jobs
      .addCase(fetchCompanyJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyJobs.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.jobs = action.payload.data.data;
        state.meta = action.payload.data.meta;
      })
      .addCase(fetchCompanyJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Job Applications
      .addCase(fetchJobApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobApplications.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.applications = action.payload.data.applications;
        state.statusCounts = action.payload.data.statusCounts;
        state.meta = action.payload.data.pagination;
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Job Application Status
      .addCase(updateJobApplicationStatus.fulfilled, (state, action: PayloadAction<any>) => {
        const updatedApp = action.payload.data;
        if (updatedApp && updatedApp.id) {
          state.applications = state.applications.map((app: any) => 
            app.id === updatedApp.id ? { ...app, status: updatedApp.status } : app
          );
        }
      })
      // Fetch Jobs By Company ID
      .addCase(fetchJobsByCompanyId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobsByCompanyId.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.jobs = action.payload.data.data;
        state.meta = action.payload.data.meta;
      })
      .addCase(fetchJobsByCompanyId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default companySlice.reducer;
