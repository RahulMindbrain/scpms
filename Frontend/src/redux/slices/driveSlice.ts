import { createSlice } from "@reduxjs/toolkit";
import { fetchJobs, updateJobStatus } from "../thunks/driveThunk";

interface DriveState {
    jobs: any[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    } | null;
    loading: boolean;
    error: string | null;
}

const initialState: DriveState = {
    jobs: [],
    meta: null,
    loading: false,
    error: null,
};

const driveSlice = createSlice({
    name: "drive",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Jobs
            .addCase(fetchJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobs.fulfilled, (state, action) => {
                state.loading = false;
                // Based on backend structure: { success: true, data: { data: [], meta: {} } }
                state.jobs = action.payload?.data?.data || [];
                state.meta = action.payload?.data?.meta || null;
            })
            .addCase(fetchJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Job Status
            .addCase(updateJobStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateJobStatus.fulfilled, (state) => {
                state.loading = false;
                // We might want to refresh the list or update locally
                // For simplicity, we'll let the component re-fetch or we could update here
            })
            .addCase(updateJobStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = driveSlice.actions;
export default driveSlice.reducer;
