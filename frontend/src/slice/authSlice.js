import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../config/axiosClient";

const checkToken = createAsyncThunk(
  "users/checkToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/user/check`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { success: false, message: "Server error" }
      );
    }
  }
);

const loginWithPassword = createAsyncThunk(
  `users/login_with_password`,
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        `/user/login-with-password`,
        credentials
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { success: false, message: "Server error" }
      );
    }
  }
);

const signUp = createAsyncThunk(
  `users/signup`,
  async (credentials, { rejectWithValue }) => {
    try {
      // Added 'credentials' to the post request here
      const response = await axiosClient.post(`/user/register`, credentials);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { success: false, message: "Server error" }
      );
    }
  }
);
const logout = createAsyncThunk(
  "users/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/user/logout`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { success: false, message: "Server error" }
      );
    }
  }
);
export const fetchProblemSolved = createAsyncThunk(
  "users/fetchProblemSolved",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/user/problem-solved");
      return res.data.data; // MUST match your backend response
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { success: false, message: "Server Error" }
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    profile: {
      problemSolved: [],
    },
    user: null,
    loading: false,
    isVerified: false,
    error: null,
    signUpData: null,
    loadingStates: {
      solved: "idle",
    },
  },
  reducers: {
    resetSignUpData: (state) => {
      state.signUpData = null;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkToken.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(checkToken.fulfilled, (state, action) => {
      state.user = action.payload.data;
      state.isVerified = !!action.payload.data;
      state.loading = false;
    });
    builder.addCase(checkToken.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(loginWithPassword.pending, (state) => {
      state.loading = true;
      state.error = null; // Also good to clear error on new login attempt
    });
    builder.addCase(loginWithPassword.fulfilled, (state, action) => {
      state.user = action.payload.data;
      state.isVerified = !!action.payload.data;
      state.loading = false;
    });
    builder.addCase(loginWithPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Added cases for signUp
    builder.addCase(signUp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.signUpData = action.payload.data;
      state.isVerified = false;
      state.loading = false;
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.user = null;
      state.isVerified = false;
      state.loading = false;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(fetchProblemSolved.pending, (state) => {
      state.loadingStates.solved = "loading";
    });
    builder.addCase(fetchProblemSolved.fulfilled, (state, action) => {
      state.profile.problemSolved = action.payload || [];
      state.loadingStates.solved = "success";
    });
    builder.addCase(fetchProblemSolved.rejected, (state) => {
      state.loadingStates.solved = "error";
    });
  },
});

export default authSlice.reducer;
export const { resetSignUpData, resetError } = authSlice.actions;
export { checkToken, loginWithPassword, signUp, logout };
