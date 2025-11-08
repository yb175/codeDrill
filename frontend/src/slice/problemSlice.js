import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../config/axiosClient";

const getProblems = createAsyncThunk(
  "problems/getproblems",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        `/problems?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { success: false, message: "server error" }
      );
    }
  }
);

const problemSlice = createSlice({
  name: "problem",
  initialState: {
    number: null,
    loading: false,
    data: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProblems.pending, (state) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(getProblems.fulfilled, (state, action) => {
      const backendCount = action.payload.count;
      if (state.number !== backendCount) {
        state.number = backendCount;
      }

      state.data = action.payload.data;
      state.loading = false;
    });
    builder.addCase(getProblems.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
  },
});

export default problemSlice.reducer;
export { getProblems };
