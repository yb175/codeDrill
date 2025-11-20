import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../config/axiosClient";

export const getProblemById = createAsyncThunk(
  "problems/getById",
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/problems/${id}`);
      return res.data?.data;  // backend meh data.data hai
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { success: false, message: "Server Error" }
      );
    }
  }
);

const problemIdSlice = createSlice({
  name: "problemById",

  initialState: {
    loading: false,
    error: null,
    problem: null
  },

  reducers: {
    clearProblem(state) {
      state.problem = null;
      state.error = null;
      state.loading = false;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getProblemById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.problem = null;
      })

      .addCase(getProblemById.fulfilled, (state, action) => {
        state.loading = false;
        state.problem = action.payload;
      })

      .addCase(getProblemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load problem";
      });
  }
});

export const { clearProblem } = problemIdSlice.actions;
export default problemIdSlice.reducer;
