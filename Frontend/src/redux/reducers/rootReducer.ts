import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../slices/authSlice";
import studentReducer from "../slices/studentSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    student: studentReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;