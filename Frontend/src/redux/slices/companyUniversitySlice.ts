import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCompanyRequests,
  requestUniversity,
} from "../thunks/superadmin/companyUniversityThunk";

interface InitialState {
  requests: any[];
  loading: boolean;
}

const initialState: InitialState = {
  requests: [],
  loading: false,
};

const companyUniversitySlice = createSlice({
  name: "companyUniversity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(requestUniversity.pending, (state) => {
        state.loading = true;
      })

      .addCase(requestUniversity.fulfilled, (state, action) => {
        state.loading = false;

        state.requests = [
          ...state.requests,
          ...action.payload,
        ];
      })

      .addCase(requestUniversity.rejected, (state) => {
        state.loading = false;
      })

      .addCase(fetchCompanyRequests.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchCompanyRequests.fulfilled, (state, action) => {
        state.loading = false;
state.requests =
  action.payload || [];
      })

      .addCase(fetchCompanyRequests.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default companyUniversitySlice.reducer;