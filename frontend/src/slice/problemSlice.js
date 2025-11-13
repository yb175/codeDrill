/**
 * Problem Slice Structure (JSON Schema)
 * 
 * {
 *   number: Number | null,
 *   loading: Boolean,
 *   data: Array | null,        // list of problems for table view
 *   error: Object | null,
 *   addProblemData: {          // reusable form state (Add + Edit)
 *     title: String,
 *     description: {
 *       text: String,
 *       imgUrl: String
 *     },
 *     problemTags: Array<String>,
 *     companyTags: Array<String>,
 *     hints: Array<Object>,
 *     acceptanceRate: Number,
 *     visibleTestCases: Array<Object>,
 *     hiddentestCases: Array<Object>,
 *     boilerplate: Array<Object>,
 *     refrenceSol: Array<Object>,
 *     problemCreater: String,
 *     difficulty: "easy" | "medium" | "hard"
 *   }
 * }
 */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../config/axiosClient";


const getProblems = createAsyncThunk(
  "problems/get",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/problems?page=${page}&limit=${limit}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { success: false, message: "server error" });
    }
  }
);

const addProblem = createAsyncThunk(
  "problems/add",
  async (problem, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/problems`, problem);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { success: false, message: "server error" });
    }
  }
);

const fetchProblem = createAsyncThunk(
  "problems/fetch",
  async (id , { rejectWithValue})=>{
    try{
      const response = await axiosClient.get(`/problems/${id}`);
      return response.data;
    }catch(err){
      return rejectWithValue(err.response?.data || {success:false, message:"server error"})
    }
  }
)
const emptyForm = {
  title: "",
  description: {
    text: "",
    imgUrl: ""
  },
  problemTags: [],
  companyTags: [],
  hints: [],
  acceptanceRate: 0,
  visibleTestCases: [],
  hiddentestCases: [],
  boilerplate: [],
  refrenceSol: [],
  problemCreater: "",
  difficulty: "easy"
};


const problemSlice = createSlice({
  name: "problem",
  initialState: {
    number: null,
    loading: false,
    data: null,
    error: null,
    addProblemData: emptyForm
  },

  reducers: {
    setProblemData: (state, action) => {
      state.addProblemData = action.payload;
    },

    // Update a direct key inside the form
    updateProblemData: (state, action) => {
      const { key, value } = action.payload;
      state.addProblemData[key] = value;
    },

    // Update a nested field inside the form
    updateNestedProblemData: (state, action) => {
      const { parentKey, childKey, value } = action.payload;
      state.addProblemData[parentKey][childKey] = value;
    },

    // Generic operations for array fields
    addToArray: (state, action) => {
      const { arrayKey, item } = action.payload;
      state.addProblemData[arrayKey].push(item);
    },

    removeFromArray: (state, action) => {
      const { arrayKey, index } = action.payload;
      state.addProblemData[arrayKey].splice(index, 1);
    },

    updateArrayItem: (state, action) => {
      const { arrayKey, index, updates } = action.payload;
      Object.assign(state.addProblemData[arrayKey][index], updates);
    },

    // Reset form for Add Problem page
    resetProblemData: (state) => {
      state.addProblemData = JSON.parse(JSON.stringify(emptyForm));
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProblems.fulfilled, (state, action) => {
        const backendCount = action.payload.count;
        if (state.number !== backendCount) state.number = backendCount;

        state.data = action.payload.data;
        state.loading = false;
      })
      .addCase(getProblems.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(addProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [...(state.data || []), action.payload.data];
        state.number = (state.number || 0) + 1;
      })
      .addCase(addProblem.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.addProblemData = action.payload.data; 
      })
      .addCase(fetchProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});

export default problemSlice.reducer;

export const {
  setProblemData,
  updateProblemData,
  updateNestedProblemData,
  addToArray,
  removeFromArray,
  updateArrayItem,
  resetProblemData
} = problemSlice.actions;

export { getProblems, addProblem,fetchProblem };
