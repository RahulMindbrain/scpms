import { createSlice } from "@reduxjs/toolkit";
import { fetchUpcomingEvents } from "@/redux/thunks/upcomingEventThunks";

export interface UpcomingEvent {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  venue: string;
  status: string;
  description?: string;

  companyApprovalStatus: string;

  company: {
    id: number;
    name: string;
    description?: string;
  };

  jobs: {
    id: number;
    title: string;
    salary: number;
    location: string;
    minCgpa: number;
    maxCgpa: number;
  }[];
}

interface UpcomingEventState {
  data: {
    items: UpcomingEvent[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };

  loading: boolean;
  error: string | null;
}

const initialState: UpcomingEventState = {
  data: {
    items: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },
  },

  loading: false,
  error: null,
};

const upcomingEventSlice = createSlice({
  name: "upcomingEvents",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload as any;
        // Thunk returns API body `data` ({ items, pagination }); tolerate nested `data` too
        const items = payload?.items ?? payload?.data?.items;
        const pagination = payload?.pagination ?? payload?.data?.pagination;

        state.data.items = Array.isArray(items) ? items : [];

        state.data.pagination = pagination ?? state.data.pagination;
      })

      .addCase(fetchUpcomingEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default upcomingEventSlice.reducer;