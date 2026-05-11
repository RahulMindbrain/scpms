import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@/redux/slices/authSlice";
import studentReducer from "@/redux/slices/studentSlice";
import companyReducer from "@/redux/slices/companySlice";
import driveReducer from "@/redux/slices/driveSlice";
import departmentReducer from "@/redux/slices/departmentSlice";
import dashboardReducer from "@/redux/slices/dashboardSlice";
import applicationReducer from "@/redux/slices/applicationSlices"
import interviewReducer from "@/redux/slices/interviewSlice";
import notificationReducer from "@/redux/slices/notificationSlice";
import skillReducer from "@/redux/slices/skillSlice";
import upcomingEventReducer from "@/redux/slices/upcomingEventSlice"
const rootReducer = combineReducers({
    auth: authReducer,
    student: studentReducer,
    company: companyReducer,
    drive: driveReducer,
    department: departmentReducer,
    dashboard: dashboardReducer,
    interview: interviewReducer,
    application:applicationReducer,
    notification: notificationReducer,
    skill: skillReducer,
    upcomingEvents: upcomingEventReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;