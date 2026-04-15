import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../slices/authSlice";
import studentReducer from "../slices/studentSlice";
import companyReducer from "../slices/companySlice";
import driveReducer from "../slices/driveSlice";
import departmentReducer from "../slices/departmentSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    student: studentReducer,
    company: companyReducer,
    drive: driveReducer,
    department: departmentReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;