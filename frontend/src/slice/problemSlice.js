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

const addProblem = createAsyncThunk(
  "problems/addproblem",
  async (problem, { rejectWithValue }) => {
    console.log(problem);
    try {
      const response = await axiosClient.post(`/problems`, problem);
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
    addProblemData: {
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
    }
  },
  reducers: {
    // Universal update for any field in addProblemData
    updateProblemData: (state, action) => {
      const { key, value } = action.payload;
      state.addProblemData[key] = value;
    },
    
    // Update nested fields (like description.text, description.imgUrl)
    updateNestedProblemData: (state, action) => {
      const { parentKey, childKey, value } = action.payload;
      if (state.addProblemData[parentKey]) {
        state.addProblemData[parentKey][childKey] = value;
      }
    },
    
    // Universal array operations for ANY array in addProblemData
    addToArray: (state, action) => {
      const { arrayKey, item } = action.payload;
      if (state.addProblemData[arrayKey]) {
        state.addProblemData[arrayKey].push(item);
      }
    },
    
    removeFromArray: (state, action) => {
      const { arrayKey, index } = action.payload;
      if (state.addProblemData[arrayKey]) {
        state.addProblemData[arrayKey].splice(index, 1);
      }
    },
    
    updateArrayItem: (state, action) => {
      const { arrayKey, index, updates } = action.payload;
      if (state.addProblemData[arrayKey] && state.addProblemData[arrayKey][index]) {
        Object.assign(state.addProblemData[arrayKey][index], updates);
      }
    },
    
    // Reset entire form
    resetProblemData: (state) => {
      state.addProblemData = {
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProblems.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getProblems.fulfilled, (state, action) => {
        const backendCount = action.payload.count;
        if (state.number !== backendCount) {
          state.number = backendCount;
        }
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
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default problemSlice.reducer;
export const { 
  updateProblemData, 
  updateNestedProblemData, 
  addToArray, 
  removeFromArray, 
  updateArrayItem,
  resetProblemData 
} = problemSlice.actions;
export { getProblems, addProblem };