import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    // here add your slices like below example
    //   auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;