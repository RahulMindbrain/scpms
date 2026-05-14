import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchStudents, fetchInactiveStudents, activateStudents, fetchStudentProfile, createStudentProfile, updateStudentProfile, fetchJobs, applyJob, fetchJobApplications, updateApplicationStatus } from "../thunks/studentThunk";

interface StudentState {
  students: any[];
  inactiveStudents: any[];
  jobs: any[];
  applications: any[];
  statusCounts: any[];
  profile: any | null;
  loading: boolean;
  error: string | null;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
}

const initialState: StudentState = {
  students: [],
  inactiveStudents: [],
  jobs: [],
  applications: [],
  statusCounts: [],
  profile: null,
  loading: false,
  error: null,
  meta: null,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Active Students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.students = action.payload.data.data;
        state.meta = action.payload.data.meta;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Inactive Students
      .addCase(fetchInactiveStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInactiveStudents.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.inactiveStudents = action.payload.data.data;
        if (action.payload.data.meta) {
          state.meta = action.payload.data.meta;
        }
      })
      .addCase(fetchInactiveStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Activate Students
      .addCase(activateStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateStudents.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(activateStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Student Profile
      .addCase(fetchStudentProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.profile = action.payload.data;
      })
      .addCase(fetchStudentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Student Profile
      .addCase(createStudentProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudentProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.profile = action.payload.data;
      })
      .addCase(createStudentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Student Profile
      .addCase(updateStudentProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.profile = action.payload.data;
      })
      .addCase(updateStudentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const payload = action.payload;
        
        if (payload?.data && Array.isArray(payload.data.data)) {
          // Case: { success: true, data: { data: [], meta: {} } }
          state.jobs = payload.data.data;
          state.meta = payload.data.meta || null;
        } else if (payload && Array.isArray(payload.data)) {
          // Case: { data: [], meta: {} } OR { success: true, data: [] }
          state.jobs = payload.data;
          state.meta = payload.meta || null;
        } else if (Array.isArray(payload)) {
          // Case: []
          state.jobs = payload;
          state.meta = null;
        } else {
          state.jobs = [];
          state.meta = null;
        }
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Apply Job
      .addCase(applyJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(applyJob.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(applyJob.rejected, (state, action) => {
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
        if (action.payload.data.pagination) {
          state.meta = {
            total: action.payload.data.pagination.totalCount,
            page: action.payload.data.pagination.currentPage,
            limit: action.payload.data.pagination.limit,
            totalPages: action.payload.data.pagination.totalPages,
          };
        }
        state.statusCounts = action.payload.data.statusCounts || [];
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Job Application Status (Student Accept/Reject)
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default studentSlice.reducer;