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
  async ({ page, limit }, { getState, rejectWithValue }) => {
    const cacheKey = `${page}-${limit}`;
    const { problem } = getState();

    if (problem.cache[cacheKey]) {
      const cachedData = problem.cache[cacheKey];
      return {
        cached: true,
        data: cachedData.data,
        count: cachedData.count,
        page,
        limit,
      };
    }

    try {
      const res = await axiosClient.get(`/problems?page=${page}&limit=${limit}`);
      const payload = res.data;

      return {
        cached: false,
        data: payload.data,
        count: payload.count,
        page,
        limit,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || { success: false });
    }
  }
);


const addProblem = createAsyncThunk(
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

const fetchProblem = createAsyncThunk(
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

const editProblem = createAsyncThunk(
  "problems/edit",
  async (problem, { rejectWithValue }) => {
    try {
      const clean = {
        ...problem,
        visibleTestCases: problem.visibleTestCases
          .filter((t) => t?.isNew)
          .map((t) => {
            const c = { ...t };
            delete c.isNew;
            return c;
          }),
        hiddentestCases: problem.hiddentestCases
          .filter((t) => t?.isNew)
          .map((t) => {
            const c = { ...t };
            delete c.isNew;
            return c;
          }),
      };

      const res = await axiosClient.patch(`/problems`, clean);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { success: false });
    }
  }
);

const emptyForm = {
  title: "",
  description: { text: "", imgUrl: "" },
  problemTags: [],
  companyTags: [],
  hints: [],
  acceptanceRate: 0,
  visibleTestCases: [],
  hiddentestCases: [],
  boilerplate: [],
  refrenceSol: [],
  problemCreater: "",
  difficulty: "easy",
};

const problemSlice = createSlice({
  name: "problem",
  initialState: {
    number: null,
    loading: false,
    data: null,
    error: null,
    cache: {},
    addProblemData: emptyForm,
  },

  reducers: {
    setProblemData: (s, a) => {
      s.addProblemData = a.payload;
    },
    updateProblemData: (s, a) => {
      s.addProblemData[a.payload.key] = a.payload.value;
    },
    updateNestedProblemData: (s, a) => {
      s.addProblemData[a.payload.parentKey][a.payload.childKey] =
        a.payload.value;
    },
addToArray: (s, a) => {
      s.addProblemData[a.payload.arrayKey].push({
        ...a.payload.item,
        isNew: true,
      });
    },
    removeFromArray: (s, a) => {
      s.addProblemData[a.payload.arrayKey].splice(a.payload.index, 1);
    },
    updateArrayItem: (s, a) => {
      Object.assign(
        s.addProblemData[a.payload.arrayKey][a.payload.index],
        a.payload.updates
      );
    },
    resetProblemData: (s) => {
      s.addProblemData = JSON.parse(JSON.stringify(emptyForm));
    },
  },

  extraReducers: (b) => {
    b.addCase(getProblems.pending, (s) => {
      s.loading = true;
      s.error = null;
    });

    b.addCase(getProblems.fulfilled, (s, a) => {
  if (a.payload.cached) {
    s.data = a.payload.data;
    s.number = a.payload.count;
    s.loading = false;
    return;
  }

  const { data, count, page, limit } = a.payload;
  const cacheKey = `${page}-${limit}`;

  s.cache[cacheKey] = { data, count };

  s.data = data;
  s.number = count;
  s.loading = false;
});

    b.addCase(getProblems.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });

    b.addCase(addProblem.pending, (s) => {
      s.loading = true;
      s.error = null;
    });

    b.addCase(addProblem.fulfilled, (s, a) => {
      s.loading = false;
      s.data = [...(s.data || []), a.payload.data];
      s.number = (s.number || 0) + 1;
      s.cache = {};
    });

    b.addCase(addProblem.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });

    b.addCase(fetchProblem.pending, (s) => {
      s.loading = true;
      s.error = null;
    });

    b.addCase(fetchProblem.fulfilled, (s, a) => {
      s.loading = false;
      const d = a.payload.data || {};

      s.addProblemData = {
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
    });

    b.addCase(fetchProblem.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });

    b.addCase(editProblem.pending, (s) => {
      s.loading = true;
      s.error = null;
    });

    b.addCase(editProblem.fulfilled, (s, a) => {
      s.loading = false;
      if (!a.payload?.data) return;

      const updated = a.payload.data;

      if (Array.isArray(s.data)) {
        s.data = s.data.map((p) => (p._id === updated._id ? updated : p));
      }

      s.addProblemData = updated;
      s.cache = {};
    });

    b.addCase(editProblem.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });
  },
});

export default problemSlice.reducer;

export const {
  setProblemData,
  updateProblemData,
  updateNestedProblemData,
  addToArray,
  removeFromArray,
  updateArrayItem,
  resetProblemData,
} = problemSlice.actions;

export { getProblems, addProblem, fetchProblem, editProblem };
