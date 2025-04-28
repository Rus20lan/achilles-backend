import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import PostgresApi from "../../services/PostgresApi";

const postgresApi = new PostgresApi();

export const getFetchDesignBrevis = createAsyncThunk(
  "design/getBrevis",
  async () => {
    try {
      const response = await postgresApi.getDesignBrevis();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Ошибка загрузки данных");
    }
  }
);

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

const designsSlice = createSlice({
  name: "designs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFetchDesignBrevis.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFetchDesignBrevis.fulfilled, (state, action) => {
        if (!action.payload) return state;
        const { data } = action.payload;
        state.data = data;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getFetchDesignBrevis.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default designsSlice.reducer;
