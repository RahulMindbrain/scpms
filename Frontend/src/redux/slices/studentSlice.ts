import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchStudents } from "../thunks/studentThunk";

interface StudentState {
  students: any[];
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
      });
  },
});

export default studentSlice.reducer;
