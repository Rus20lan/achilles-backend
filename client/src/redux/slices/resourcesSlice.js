import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import PostgresApi from '../../services/PostgresApi';

const postgresApi = new PostgresApi();

export const getFetchResourceName = createAsyncThunk(
  'resource/getName',
  async (_, thunkAPI) => {
    try {
      const response = await postgresApi.getResourcesName(
        '/api/resources/name'
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || 'Ошибка загрузики данных'
      );
    }
  }
);

const initialState = {
  data: [],
  success: false,
  isLoading: false,
  error: null,
};

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFetchResourceName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFetchResourceName.fulfilled, (state, action) => {
        if (!action.payload) return state;
        const { success, data, message } = action.payload;
        state.data = data;
        state.success = success;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getFetchResourceName.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export default resourcesSlice.reducer;
