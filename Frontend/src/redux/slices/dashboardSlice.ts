import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboardStats } from "../thunks/dashboardThunk";

export interface DeptStat {
    department: string;
    totalStudents: number;
    placedStudents: number;
    percentage: number;
}

export interface DashboardData {
    totalPlacedStudents: number;
    avgSalary: number;
    deptStats: DeptStat[];
    deptAvgSalary: any[]; // Assuming it's an array of avg salary per dept
}

interface DashboardState {
    data: DashboardData | null;
    loading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    data: null,
    loading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default dashboardSlice.reducer;
