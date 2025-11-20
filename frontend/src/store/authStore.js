import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice.js";
import problemReducer from "../slice/problemSlice.js"
import problemIdReducer from "../slice/problemWorkspaceSlice.js"
const store = configureStore({
    reducer: {
        auth: authReducer,
        problem : problemReducer,
        problemById : problemIdReducer
    }
});

export default store;