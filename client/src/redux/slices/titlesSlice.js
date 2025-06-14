import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import PostgresApi from '../../services/PostgresApi';

const postgresApi = new PostgresApi();

export const getFetchTitleBrevis = createAsyncThunk(
  'title/getBrevis',
  async (_, thunkAPI) => {
    try {
      const response = await postgresApi.getBrevis('/api/titles/brevis');
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || 'Ошибка загрузки данных'
      );
    }
  }
);

const initialState = {
  data: [],
  succes: false,
  isLoading: false,
  error: null,
};

const titlesSlice = createSlice({
  name: 'titles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFetchTitleBrevis.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFetchTitleBrevis.fulfilled, (state, action) => {
        if (!action.payload) return state;
        const { succes, data } = action.payload;
        state.data = data;
        state.succes = succes;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getFetchTitleBrevis.rejected, (state, action) => {
        state.isLoading = false;
        state.succes = false;
        state.error = action.payload;
      });
  },
});

export default titlesSlice.reducer;
