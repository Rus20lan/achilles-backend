import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import PostgresApi from '../../services/PostgresApi';

const postgresApi = new PostgresApi();

export const getFetchDesignBrevis = createAsyncThunk(
  'design/getBrevis',
  async (_, thunkAPI) => {
    try {
      const response = await postgresApi.getBrevis('/api/designs/brevis');
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
  success: false,
  isLoading: false,
  error: null,
};

const designsSlice = createSlice({
  name: 'designs',
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
        const { success, data, message } = action.payload;
        state.data = data;
        state.success = success;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getFetchDesignBrevis.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export default designsSlice.reducer;
