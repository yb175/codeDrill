import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice.js";
import problemReducer from "../slice/problemSlice.js"

const store = configureStore({
    reducer: {
        auth: authReducer,
        problem : problemReducer
    }
});

export default store;