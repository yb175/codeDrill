import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../config/axiosClient";

// Cache TTL - 5 minutes
const SOLVED_TTL = 5 * 60 * 1000;

const checkToken = createAsyncThunk(
  "users/checkToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/user/check`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { success: false });
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
      return rejectWithValue(err.response?.data || { success: false });
    }
  }
);

const signUp = createAsyncThunk(
  `users/signup`,
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/user/register`, credentials);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { success: false });
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
      return rejectWithValue(err.response?.data || { success: false });
    }
  }
);

// ⭐ UPDATED WITH CACHING
export const fetchProblemSolved = createAsyncThunk(
  "users/fetchProblemSolved",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const now = Date.now();

    // Check cache
    if (
      auth.solvedCache &&
      now - auth.solvedCacheTimestamp < SOLVED_TTL
    ) {
      console.log("[Solved Cache Hit]");
      return { cached: true, data: auth.solvedCache };
    }

    try {
      console.log("[Solved Cache Miss]");
      const res = await axiosClient.get("/user/problem-solved");
      return { cached: false, data: res.data.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || { success: false });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    profile: { problemSolved: [] },
    user: null,
    loading: false,
    isVerified: false,
    error: null,
    signUpData: null,

    loadingStates: {
      solved: "idle",
    },

    // ⭐ cache storage
    solvedCache: null,
    solvedCacheTimestamp: 0,
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
    builder

      // CHECK TOKEN
      .addCase(checkToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkToken.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.isVerified = !!action.payload.data;
        state.loading = false;
      })
      .addCase(checkToken.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // LOGIN
      .addCase(loginWithPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithPassword.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.isVerified = true;
        state.loading = false;
      })
      .addCase(loginWithPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SIGNUP
      .addCase(signUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.signUpData = action.payload.data;
        state.loading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isVerified = false;
        state.solvedCache = null;
        state.solvedCacheTimestamp = 0;
        state.loading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ⭐ FETCH SOLVED WITH CACHE
      .addCase(fetchProblemSolved.pending, (state) => {
        state.loadingStates.solved = "loading";
      })
      .addCase(fetchProblemSolved.fulfilled, (state, action) => {
        state.loadingStates.solved = "success";

        // if cached: do NOT override cache timestamp
        if (action.payload.cached) {
          state.profile.problemSolved = action.payload.data;
          return;
        }

        // else fresh data
        state.profile.problemSolved = action.payload.data;
        state.solvedCache = action.payload.data;
        state.solvedCacheTimestamp = Date.now();
      })
      .addCase(fetchProblemSolved.rejected, (state) => {
        state.loadingStates.solved = "error";
      });
  },
});

export default authSlice.reducer;

export const { resetSignUpData, resetError } = authSlice.actions;
export { checkToken, loginWithPassword, signUp, logout };
