import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import PostgresApi from '../../services/PostgresApi';

const postgresApi = new PostgresApi();

export const getFetchWithPagination = createAsyncThunk(
  'models/fetchDataWithPagination',
  async (objectParams, { signal, rejectWithValue }) => {
    try {
      const response = await postgresApi.fetchWithPagination({
        ...objectParams,
        signal,
      });
      return response;
    } catch (error) {
      if (error.name === 'AbortError') {
        return rejectWithValue('Запрос отменён');
      }
      return rejectWithValue(error.message || 'Ошибка загрузки данных');
    }
  }
);
const initialState = {
  data: [],
  isEmpty: false,
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
  isLoading: false,
  error: null,
  aborted: false, // Новое поле для отслеживания отменённых запросов
};

const dynamicPaginationSlice = createSlice({
  name: 'dynamicPagination',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload.page;
      state.aborted = false; // Сбрасываем флаг при изменении страницы
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
      state.page = 1;
      state.aborted = false;
    },
    // Редюсер для сброса пагинации к начальным значениям
    resetPagination: (state) => {
      state.limit = Number(initialState.limit);
      state.page = Number(initialState.page);
      state.aborted = false;
    },
    clearAbortedFlag: (state) => {
      state.aborted = false;
    },
  },
  extraReducers: (builder) => {
    // Обработка getFetchWithPagination
    builder
      .addCase(getFetchWithPagination.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.aborted = false;
      })
      .addCase(getFetchWithPagination.fulfilled, (state, action) => {
        if (state.aborted) return;
        if (!action.payload) {
          return state;
        }
        const { data, isEmpty, pagination } = action.payload;

        state.data = data;
        state.isEmpty = isEmpty;
        if (pagination) {
          const {
            page,
            limit,
            totalItems,
            totalPages,
            hasNextPage,
            hasPrevPage,
          } = pagination;
          state.page = Number(page);
          state.limit = Number(limit);
          state.totalItems = totalItems;
          state.totalPages = totalPages;
          state.hasNextPage = hasNextPage;
          state.hasPrevPage = hasPrevPage;
        }

        state.isLoading = false;
        state.error = null;
      })
      .addCase(getFetchWithPagination.rejected, (state, action) => {
        if (action.payload === 'Запрос отменён') {
          state.aborted = true;
          return;
        }
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, resetPagination } =
  dynamicPaginationSlice.actions;

export default dynamicPaginationSlice.reducer;
