// store/applications/applications.slice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchApplications } from "../thunks/applicationThunk";

interface ApplicationsState {
  applications: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ApplicationsState = {
  applications: [],
  loading: false,
  error: null,
};

const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both paginated (action.payload.data) and non-paginated (action.payload as array) responses
        state.applications = Array.isArray(action.payload) 
          ? action.payload 
          : (action.payload?.data || []);
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default applicationsSlice.reducer;