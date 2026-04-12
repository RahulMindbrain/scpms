import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../slices/authSlice";
import studentReducer from "../slices/studentSlice";

import companyReducer from "../slices/companySlice";

const rootReducer = combineReducers({
    auth: authReducer,
    student: studentReducer,
    company: companyReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;