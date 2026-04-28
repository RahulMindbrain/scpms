import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchSchedules, createSchedule, updateSchedule, deleteSchedule, fetchSchedulesByCompany, fetchCompanySchedules, approveSchedule, fetchScheduleMessages, sendScheduleMessage, fetchScheduleApplications } from "../thunks/interviewThunk";

interface InterviewState {
  schedules: any[];
  applications: any[];
  loading: boolean;
  error: string | null;
}

const initialState: InterviewState = {
  schedules: [],
  applications: [],
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
        state.error = typeof action.payload === 'string' ? action.payload : "Failed to fetch schedules";
      })
      // Fetch Schedules By Company
      .addCase(fetchSchedulesByCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedulesByCompany.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.schedules = action.payload.data;
      })
      .addCase(fetchSchedulesByCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : "Failed to fetch schedules by company";
      })
      // Fetch Company Schedules
      .addCase(fetchCompanySchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanySchedules.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.schedules = action.payload.data;
      })
      .addCase(fetchCompanySchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : "Failed to fetch company schedules";
      })
      // Create Schedule
      .addCase(createSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSchedule.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (action.payload.success !== false && action.payload.data) {
          state.schedules.unshift(action.payload.data);
        }
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : "Failed to create schedule";
      })
      // Update Schedule
    .addCase(updateSchedule.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      if (action.payload.success !== false && action.payload.data) {
        const updated = action.payload.data;
        state.schedules = state.schedules.map((s) =>
          s.id === updated.id
            ? { ...s, ...updated }
            : s
        );
      }
    })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : "Failed to update schedule";
      })
      // Approve Schedule
      .addCase(approveSchedule.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const updated = action.payload.data;
        state.schedules = state.schedules.map((s) =>
          s.id === updated.id ? { ...s, ...updated } : s
        );
      })
      .addCase(approveSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : "Failed to update approval status";
      })
      // Delete Schedule

      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.schedules = state.schedules.filter((s) => s.id !== action.payload.id);
      })
      // Fetch Messages
      .addCase(fetchScheduleMessages.fulfilled, (state, action: PayloadAction<any>) => {
        const { id, messages } = action.payload;
        state.schedules = state.schedules.map((s) =>
          s.id === id ? { ...s, messages } : s
        );
      })
      // Send Message
      .addCase(sendScheduleMessage.fulfilled, (state, action: PayloadAction<any>) => {
        const { id, raw } = action.payload;
        const newMessage = raw.data || raw;
        state.schedules = state.schedules.map((s) =>
          s.id === id ? { ...s, messages: [...(s.messages || []), newMessage] } : s
        );
      })
      // Fetch Applications
      .addCase(fetchScheduleApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScheduleApplications.fulfilled, (state, action: PayloadAction<any>) => {
        const { id, applications } = action.payload;
        state.loading = false;
        state.applications = applications || [];
        state.schedules = state.schedules.map((s) =>
          s.id === id ? { ...s, applications } : s
        );
      })
      .addCase(fetchScheduleApplications.rejected, (state, action) => {
        state.loading = false;
        state.applications = [];
        state.error = typeof action.payload === 'string' ? action.payload : "Failed to fetch applications";
      });
  },
});


export const { clearError } = interviewSlice.actions;
export default interviewSlice.reducer;
