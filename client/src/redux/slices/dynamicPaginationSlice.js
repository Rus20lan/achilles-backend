import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import PostgresApi from "../../services/PostgresApi";

const postgresApi = new PostgresApi();

export const getFetchWithPagination = createAsyncThunk(
  "models/fetchDataWithPagination",
  async (objectParams) => {
    return await postgresApi.fetchWithPagination(objectParams);
  }
);
const initialState = {
  data: [],
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
  isLoading: false,
  error: null,
};

const dynamicPaginationSlice = createSlice({
  name: "dynamicPagination",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload.page;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
      // При изменении limit, сбрасываем page на 1 страницу
      state.page = 1;
    },
    // Редюсер для сброса пагинации к начальным значениям
    resetPagination: (state) => {
      state.limit = initialState.limit;
      state.page = initialState.page;
    },
  },
  extraReducers: (builder) => {
    // Обработка getFetchWithPagination
    builder
      .addCase(getFetchWithPagination.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFetchWithPagination.fulfilled, (state, action) => {
        const { data, pagination } = action.payload;
        const {
          page,
          limit,
          totalItems,
          totalPages,
          hasNextPage,
          hasPrevPage,
        } = pagination;
        state.data = data;
        state.page = page;
        state.limit = limit;
        state.totalItems = totalItems;
        state.totalPages = totalPages;
        state.hasNextPage = hasNextPage;
        state.hasPrevPage = hasPrevPage;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getFetchWithPagination.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Ошибка загрузки данных";
      });
  },
});

export const { setPage, setLimit, resetPagination } =
  dynamicPaginationSlice.actions;

export default dynamicPaginationSlice.reducer;
