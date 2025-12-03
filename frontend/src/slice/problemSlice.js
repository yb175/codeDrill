import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../config/axiosClient";

/* ------------------------ ASYNC THUNKS ------------------------ */

export const getProblems = createAsyncThunk(
  "problems/get",
  async ({ page, limit }, { getState, rejectWithValue }) => {
    const cacheKey = `${page}-${limit}`;
    const { problem } = getState();

    if (problem.cache[cacheKey]) {
      return { cached: true, ...problem.cache[cacheKey], page, limit };
    }

    try {
      const res = await axiosClient.get(
        `/problems?page=${page}&limit=${limit}`
      );
      return {
        cached: false,
        data: res.data.data,
        count: res.data.count,
        page,
        limit,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || { success: false });
    }
  }
);

export const addProblem = createAsyncThunk(
  "problems/add",
  async (problem, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(`/problems`, problem);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { success: false });
    }
  }
);

export const fetchProblem = createAsyncThunk(
  "problems/fetch",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/problems/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { success: false });
    }
  }
);

export const editProblem = createAsyncThunk(
  "problems/edit",
  async (problem, { rejectWithValue }) => {
    try {
      const clean = {
        ...problem,
        visibleTestCases: problem.visibleTestCases
          .filter((t) => t?.isNew)
          .map((t) => ({ ...t, isNew: undefined })),
        hiddentestCases: problem.hiddentestCases
          .filter((t) => t?.isNew)
          .map((t) => ({ ...t, isNew: undefined })),
      };

      const res = await axiosClient.patch(`/problems`, clean);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { success: false });
    }
  }
);

/* ------------------ FIXED runProblem ------------------ */

export const runProblem = createAsyncThunk(
  "problems/run",
  async ({ problem, code, language }, { rejectWithValue }) => {
    const payload = {
      language,
      code,
      problemNumber: problem.problemNumber,
      language: problem.language,
      functionName: problem.functionName,
      returnType: problem.returnType,
      inputs: problem.inputs,
    };
    const res = await axiosClient.post(`/submissions/run`, payload);
    return res.data;
  }
);
/* ------------------------ EMPTY FORM ------------------------ */

const emptyForm = {
  title: "",
  description: { text: "", imgUrl: "" },
  problemTags: [],
  companyTags: [],
  hints: [],
  acceptanceRate: 0,
  visibleTestCases: [],
  hiddentestCases: [],
  boilerplate: {
    functionSignature: {
      functionName: "",
      returnType: "",
      inputs: [],
    },
  },
  refrenceSol: [],
  problemCreater: "",
  difficulty: "easy",
};

/* ------------------------ SLICE ------------------------ */

const problemSlice = createSlice({
  name: "problem",
  initialState: {
    number: null,
    loading: false,
    data: null,
    error: null,
    cache: {},
    addProblemData: emptyForm,
    runResult: null, // added ensure clean state
  },

  reducers: {
    setProblemData: (state, action) => {
      state.addProblemData = action.payload;
    },

    updateProblemData: (state, action) => {
      const { key, value } = action.payload;
      state.addProblemData[key] = value;
    },

    updateNestedProblemData: (state, action) => {
      const { parentKey, childKey, value } = action.payload;
      state.addProblemData[parentKey][childKey] = value;
    },

    updateFunctionSignature: (state, action) => {
      state.addProblemData.boilerplate.functionSignature = {
        ...state.addProblemData.boilerplate.functionSignature,
        ...action.payload,
      };
    },

    updateFunctionInputs: (state, action) => {
      state.addProblemData.boilerplate.functionSignature.inputs =
        action.payload;
    },

    addToArray: (state, action) => {
      const { arrayKey, item } = action.payload;
      state.addProblemData[arrayKey].push({ ...item, isNew: true });
    },

    removeFromArray: (state, action) => {
      const { arrayKey, index } = action.payload;
      state.addProblemData[arrayKey].splice(index, 1);
    },

    updateArrayItem: (state, action) => {
      const { arrayKey, index, updates } = action.payload;
      Object.assign(state.addProblemData[arrayKey][index], updates);
    },

    resetProblemData: (state) => {
      state.addProblemData = JSON.parse(JSON.stringify(emptyForm));
    },
  },

  /* ------------------------ EXTRA REDUCERS ------------------------ */

  extraReducers: (builder) => {
    builder

      /* -------- GET -------- */
      .addCase(getProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProblems.fulfilled, (state, action) => {
        const { cached, data, count, page, limit } = action.payload;

        if (!cached) {
          const cacheKey = `${page}-${limit}`;
          state.cache[cacheKey] = { data, count };
        }

        state.data = data;
        state.number = count;
        state.loading = false;
        state.error = null;
      })
      .addCase(getProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- ADD -------- */
      .addCase(addProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = [...(state.data || []), action.payload.data];
        state.number = (state.number || 0) + 1;
        state.cache = {};
      })
      .addCase(addProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- FETCH -------- */
      .addCase(fetchProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const d = action.payload.data || {};
        state.addProblemData = {
          ...d,
          visibleTestCases: (d.visibleTestCases || []).map((t) => ({
            ...t,
            isNew: false,
          })),
          hiddentestCases: (d.hiddentestCases || []).map((t) => ({
            ...t,
            isNew: false,
          })),
        };
      })
      .addCase(fetchProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- EDIT -------- */
      .addCase(editProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const updated = action.payload?.data;
        if (!updated) return;

        if (Array.isArray(state.data)) {
          state.data = state.data.map((p) =>
            p._id === updated._id ? updated : p
          );
        }

        state.addProblemData = updated;
        state.cache = {};
      })
      .addCase(editProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- RUN FIXED -------- */
      .addCase(runProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.runResult = null; // reset before new run
      })
      .addCase(runProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.runResult = action.payload;
      })
      .addCase(runProblem.rejected, (state, action) => {
        state.loading = false;

        // IMPORTANT: send error to UI
        state.runResult = {
          stderr: action.payload?.message || "Server Error",
          data: [],
        };

        state.error = action.payload;
      });
  },
});

/* ------------------------ EXPORTS ------------------------ */

export default problemSlice.reducer;

export const {
  setProblemData,
  updateProblemData,
  updateNestedProblemData,
  updateFunctionSignature,
  updateFunctionInputs,
  addToArray,
  removeFromArray,
  updateArrayItem,
  resetProblemData,
} = problemSlice.actions;
