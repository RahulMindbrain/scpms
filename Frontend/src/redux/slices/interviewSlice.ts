import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchSchedules, createSchedule, updateSchedule, deleteSchedule } from "../thunks/interviewThunk";

interface InterviewState {
  schedules: any[];
  loading: boolean;
  error: string | null;
}

const initialState: InterviewState = {
  schedules: [],
  loading: false,
  error: null,
};

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Schedules
      .addCase(fetchSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.schedules = action.payload.data;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Schedule
      .addCase(createSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSchedule.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.schedules.unshift(action.payload.data);
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Schedule
      .addCase(updateSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSchedule.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const updatedSchedule = action.payload.data;
        state.schedules = state.schedules.map((s) => 
          s.id === updatedSchedule.id ? updatedSchedule : s
        );
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Schedule
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.schedules = state.schedules.filter((s) => s.id !== action.payload.id);
      });
  },
});

export const { clearError } = interviewSlice.actions;
export default interviewSlice.reducer;
