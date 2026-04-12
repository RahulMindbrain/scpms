import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchCompanies, fetchInactiveCompanies, activateCompanies } from "../thunks/companyThunk";

interface CompanyState {
  companies: any[];
  inactiveCompanies: any[];
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
      });
  },
});

export default companySlice.reducer;
